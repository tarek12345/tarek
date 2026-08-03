<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use setasign\Fpdi\Fpdi;
use Illuminate\Support\Str;
use App\Models\Paix;
use App\Models\PaixConfig;


class PaixController extends Controller
{


/*
|--------------------------------------------------------------------------
| Générer fiche de paie depuis PDF importé
|--------------------------------------------------------------------------
*/

public function genererDepuisImport(Request $request)
{
$validated = $request->validate([

    'user_id'=>'required|exists:users,id',

    // salarié
    'nom'=>'required|string',
    'prenom'=>'nullable|string',
    'matricule'=>'nullable|string',
    'cin'=>'nullable|string',
    'cnss'=>'nullable|string',
    'poste'=>'nullable|string',

    // famille
    'chef_famille'=>'nullable',
    'nombre_enfants'=>'nullable|integer',

    // salaire
    'salaire_brut'=>'required|numeric',
    'retenue_cnss'=>'required|numeric',
    'salaire_brut_imposable'=>'required|numeric',
    'retenue_source'=>'required|numeric',
    'contribution_sociale'=>'required|numeric',
    'salaire_net'=>'required|numeric',

    // société
    'entreprise'=>'nullable|string',
    'matricule_fiscal'=>'nullable|string',

    // période
    'mois'=>'nullable|string',
    'annee'=>'nullable|string'

]);
if(!$request->hasFile('pdf_modele')){

return response()->json([
    'error'=>'Aucun fichier PDF importé.'
],400);

}
$file=$request->file('pdf_modele');



$tempPath =
storage_path('app/temp_paix.pdf');



$file->move(
storage_path('app'),
'temp_paix.pdf'
);



$pdf = new Fpdi();



$pdf->setSourceFile($tempPath);



$template =
$pdf->importPage(1);



$size =
$pdf->getTemplateSize($template);



$pdf->AddPage(
$size['orientation'],
[
$size['width'],
$size['height']
]
);



$pdf->useTemplate($template);



$pdf->SetFont(
'Arial',
'B',
10
);



$pdf->SetTextColor(0,0,0);




/*
|--------------------------------------------------------------------------
| Informations salarié
|--------------------------------------------------------------------------
*/


$pdf->SetXY(50,40);

$pdf->Write(
0,
$validated['nom'].' '.$validated['prenom']
);



$pdf->SetXY(50,50);

$pdf->Write(
0,
$validated['matricule']
);



$pdf->SetXY(50,60);

$pdf->Write(
0,
$validated['cnss']
);



$pdf->SetXY(50,70);

$pdf->Write(
0,
$validated['poste']
);





/*
|--------------------------------------------------------------------------
| Situation familiale
|--------------------------------------------------------------------------
*/


$pdf->SetXY(150,40);

$pdf->Write(
0,
isset($validated['chef_famille'])
&& $validated['chef_famille']
?'Oui'
:'Non'
);



$pdf->SetXY(150,50);

$pdf->Write(
0,
$validated['nombre_enfants']
);





/*
|--------------------------------------------------------------------------
| Salaire
|--------------------------------------------------------------------------
*/


$pdf->SetXY(150,90);

$pdf->Write(
0,
number_format(
$validated['salaire_brut'],
3
).' DT'
);



$pdf->SetXY(150,105);

$pdf->Write(
0,
number_format(
$validated['retenue_cnss'],
3
).' DT'
);



$pdf->SetXY(150,120);

$pdf->Write(
0,
number_format(
$validated['salaire_brut_imposable'],
3
).' DT'
);



$pdf->SetXY(150,135);

$pdf->Write(
0,
number_format(
$validated['retenue_source'],
3
).' DT'
);



$pdf->SetXY(150,150);

$pdf->Write(
0,
number_format(
$validated['contribution_sociale'],
3
).' DT'
);



$pdf->SetXY(150,170);

$pdf->Write(
0,
number_format(
$validated['salaire_net'],
3
).' DT'
);



unlink($tempPath);





$filename =
'paie_'.Str::uuid().'.pdf';



$relativePath =
'paies/'.$filename;



$absolutePath =
storage_path(
'app/public/'.$relativePath
);



$pdf->Output(
$absolutePath,
'F'
);



$validated['pdf_path']=$relativePath;



$paix =
Paix::create($validated);



return response()->json([

'message'=>'Fiche de paie générée',

'pdf_url'=>asset(
'storage/'.$relativePath
),

'paix'=>$paix

],201);


}






/*
|--------------------------------------------------------------------------
| Ajouter une paie
|--------------------------------------------------------------------------
*/

public function paixstore(Request $request)
{

$validated=$request->validate([


'user_id'=>'required|exists:users,id',

'nom'=>'required|string',

'prenom'=>'nullable|string',

'salaire_brut'=>'required|numeric',

'salaire_net'=>'required|numeric'


]);



try {

    $paix = Paix::create($validated);

} catch(\Exception $e) {

    return response()->json([
        'error'=>$e->getMessage()
    ],500);

}


return response()->json([

'message'=>'Paie enregistrée',

'paix'=>$paix

],201);


}






/*
|--------------------------------------------------------------------------
| Liste paies utilisateur
|--------------------------------------------------------------------------
*/


public function paixsuser($id)
{


$paies =
Paix::where('user_id',$id)
->orderBy('created_at','desc')
->paginate(5);



return response()->json([

'total'=>$paies->total(),

'per_page'=>$paies->perPage(),

'current_page'=>$paies->currentPage(),

'last_page'=>$paies->lastPage(),

'paies'=>$paies->items()


]);


}






/*
|--------------------------------------------------------------------------
| Supprimer paie
|--------------------------------------------------------------------------
*/


public function deletePaix($id)
{


$paix =
Paix::find($id);



if(!$paix){

return response()->json([
'message'=>'Paie introuvable'
],404);

}



if($paix->pdf_path &&
file_exists(
storage_path(
'app/public/'.$paix->pdf_path
)
)){


unlink(
storage_path(
'app/public/'.$paix->pdf_path
)
);


}



$paix->delete();



return response()->json([

'message'=>'Paie supprimée avec succès'

]);


}






/*
|--------------------------------------------------------------------------
| Toutes les paies avec utilisateurs
|--------------------------------------------------------------------------
*/


public function getAllPaixWithUsers()
{


$paies =
Paix::with('user')
->orderBy('created_at','desc')
->get();



return response()->json([

'success'=>true,

'paies'=>$paies

]);


}







/*
|--------------------------------------------------------------------------
| Paies utilisateur connecté
|--------------------------------------------------------------------------
*/


public function getPaix(Request $request)
{


$paies =
Paix::where(
'user_id',
auth()->id()
)
->orderBy('created_at','desc')
->get();



return response()->json([

'paies'=>$paies

]);


}






/*
|--------------------------------------------------------------------------
| Config Paie
|--------------------------------------------------------------------------
*/


public function indexpaixConfig()
{

return response()->json(
PaixConfig::all()
);

}




public function storepaixConfig(Request $request)
{
    $request->validate([
        'nom' => 'required|string|max:255',
        'prenom' => 'required|string|max:255',
        'matricule' => 'required|string|max:255',
        'cin' => 'required|string|max:50',
        'cnss' => 'required|string|max:50',
        'poste' => 'required|string|max:255',
        'entreprise' => 'required|string|max:255',
        'matricule_fiscal' => 'required|string|max:255',
    ]);

    $config = PaixConfig::create($request->all());

    return response()->json([
        'message' => 'Configuration enregistrée avec succès',
        'data' => $config
    ], 201);
}





public function destroypaixConfig($id)
{
    $config = PaixConfig::findOrFail($id);
    $config->delete();

    return response()->json([
        'message' => 'Configuration supprimée'
    ]);
}

public function genererDepuisImportPaix(Request $request)
{
    $validated = $request->validate([

        'user_id' => 'required|exists:users,id',

        // salarié
        'nom' => 'required|string',
        'prenom' => 'nullable|string',
        'matricule' => 'nullable|string',
        'cin' => 'nullable|string',
        'cnss' => 'nullable|string',
        'poste' => 'nullable|string',

        // famille
        'chef_famille' => 'nullable',
        'nombre_enfants' => 'nullable|integer',

        // salaire
        'salaire_brut' => 'required|numeric',
        'retenue_cnss' => 'required|numeric',
        'salaire_brut_imposable' => 'required|numeric',
        'retenue_source' => 'required|numeric',
        'contribution_sociale' => 'required|numeric',
        'salaire_net' => 'required|numeric',

        // société
        'entreprise' => 'nullable|string',
        'matricule_fiscal' => 'nullable|string',

        // période
        'mois' => 'nullable|string',
        'annee' => 'nullable|string'

    ]);


    /*
    |--------------------------------------------------------------------------
    | Correction checkbox
    |--------------------------------------------------------------------------
    */

    $validated['chef_famille'] =
        isset($validated['chef_famille']) 
        && $validated['chef_famille'] == '1'
        ? 1
        : 0;


    $validated['nombre_enfants'] =
        $validated['nombre_enfants'] ?? 0;



    /*
    |--------------------------------------------------------------------------
    | Vérification PDF
    |--------------------------------------------------------------------------
    */

    if (!$request->hasFile('pdf_modele')) {

        return response()->json([
            'error' => 'Aucun fichier PDF importé.'
        ],400);

    }



    try {


        /*
        |--------------------------------------------------------------------------
        | Import modèle PDF
        |--------------------------------------------------------------------------
        */


        $file = $request->file('pdf_modele');


        $tempPath =
            storage_path('app/temp_paix.pdf');


        $file->move(
            storage_path('app'),
            'temp_paix.pdf'
        );



        $pdf = new Fpdi();



        $pdf->setSourceFile($tempPath);



        $template =
            $pdf->importPage(1);



        $size =
            $pdf->getTemplateSize($template);



        $pdf->AddPage(
            $size['orientation'],
            [
                $size['width'],
                $size['height']
            ]
        );



        $pdf->useTemplate($template);



        $pdf->SetFont(
            'Arial',
            'B',
            10
        );


        $pdf->SetTextColor(0,0,0);



        /*
        |--------------------------------------------------------------------------
        | Informations salarié
        |--------------------------------------------------------------------------
        */

// Société
$pdf->SetXY(80, 122);
$pdf->Write(0, $validated['entreprise']);

// Matricule fiscal
$pdf->SetXY(35, 88);
$pdf->Write(0, $validated['matricule_fiscal']);

// Chef famille
$pdf->SetXY(65, 99);
$pdf->Write(0, $validated['chef_famille'] ? 'X' : '');

// Nombre enfants
$pdf->SetXY(45, 110);
$pdf->Write(0, $validated['nombre_enfants']);

// Mois
$pdf->SetXY(138, 77);
$pdf->Write(0, $validated['mois']);

// Année
$pdf->SetXY(138, 88);
$pdf->Write(0, $validated['annee']);

// Nom
$pdf->SetXY(138, 99);
$pdf->Write(0, $validated['nom']);

// Prénom
$pdf->SetXY(172, 99);
$pdf->Write(0, $validated['prenom']);

// CNSS
$pdf->SetXY(138, 110);
$pdf->Write(0, $validated['cnss']);

// Poste
$pdf->SetXY(35, 122);
$pdf->Write(0, $validated['poste'] ?? '');

        /*
        |--------------------------------------------------------------------------
        | Situation familiale
        |--------------------------------------------------------------------------
        */


        $pdf->SetXY(150,40);

        $pdf->Write(
            0,
            $validated['chef_famille'] == 1
            ? 'Oui'
            : 'Non'
        );


        $pdf->SetXY(150,50);

        $pdf->Write(
            0,
            $validated['nombre_enfants']
        );



        /*
        |--------------------------------------------------------------------------
        | Salaire
        |--------------------------------------------------------------------------
        */


       $pdf->SetXY(55,137);
$pdf->Write(0, number_format($validated['salaire_brut'],3));

$pdf->SetXY(55,148);
$pdf->Write(0, number_format($validated['retenue_cnss'],3));

$pdf->SetXY(55,159);
$pdf->Write(0, number_format($validated['salaire_brut_imposable'],3));

$pdf->SetXY(118,137);
$pdf->Write(0, number_format($validated['retenue_cnss'],3));

$pdf->SetXY(118,148);
$pdf->Write(0, number_format($validated['salaire_brut_imposable'],3));

$pdf->SetXY(118,159);
$pdf->Write(0, number_format($validated['contribution_sociale'],3));

$pdf->SetXY(180,137);
$pdf->Write(0, number_format($validated['salaire_brut'],3));

$pdf->SetXY(180,148);
$pdf->Write(0, number_format($validated['retenue_source'],3));

$pdf->SetXY(96,181);
$pdf->Write(0, number_format($validated['salaire_net'],3));



        /*
        |--------------------------------------------------------------------------
        | Sauvegarde PDF
        |--------------------------------------------------------------------------
        */


        if (file_exists($tempPath)) {
            unlink($tempPath);
        }



        $folder =
            storage_path('app/public/paies');



        if (!file_exists($folder)) {

            mkdir(
                $folder,
                0777,
                true
            );

        }



        $filename =
            'paie_'.Str::uuid().'.pdf';



        $relativePath =
            'paies/'.$filename;



        $absolutePath =
            storage_path(
                'app/public/'.$relativePath
            );



        $pdf->Output(
            $absolutePath,
            'F'
        );



        /*
        |--------------------------------------------------------------------------
        | Enregistrement DB
        |--------------------------------------------------------------------------
        */


        $validated['pdf_path'] =
            $relativePath;



        $paie =
            Paix::create($validated);



return response()->file(
    $absolutePath,
    [
        'Content-Type'=>'application/pdf',
        'Content-Disposition'=>'attachment; filename="fiche_paie.pdf"'
    ]
);



    } catch(\Exception $e) {


        return response()->json([

            'error'=>$e->getMessage(),

            'line'=>$e->getLine(),

            'file'=>$e->getFile()

        ],500);


    }

}

}