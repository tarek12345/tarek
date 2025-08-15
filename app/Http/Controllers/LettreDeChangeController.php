<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use setasign\Fpdi\Fpdi;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller; 
use App\Models\Traite;
use App\Models\TraiteConfig;
class LettreDeChangeController extends Controller
{

public function genererDepuisImport(Request $request)
{
    $validated = $request->validate([
        'user_id' => 'required|exists:users,id',
        'nom' => 'required|string',
        'rib' => 'required|string',
        'date_echeance' => 'required|date',
        'montant' => 'required|numeric',
        'ml' => 'required|string',
        'date_creation' => 'required|date',
        'lieu' => 'required|string',
        'lieuc' => 'required|string',
        'nd' => 'required|string',
        'domicilation' => 'required|string',
        'valeur_en' => 'required|string'
    ]);

    if (!$request->hasFile('pdf_modele')) {
        return response()->json(['error' => 'Aucun fichier PDF importé.'], 400);
    }

    $file = $request->file('pdf_modele');
    $tempPath = storage_path('app/temp_modele.pdf');
    $file->move(storage_path('app'), 'temp_modele.pdf');

    $pdf = new Fpdi();
    $pdf->setSourceFile($tempPath);
    $template = $pdf->importPage(1);
    $size = $pdf->getTemplateSize($template);
    $pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
    $pdf->useTemplate($template);
    $pdf->SetFont('Arial', 'B', 14);
    $pdf->SetTextColor(0, 0, 0);

    // ✏️ Remplir les champs dans le PDF
    $pdf->SetXY(30, 70);
    $pdf->Write(0, $validated['nom']);

    $pdf->SetXY(230, 120);
    $pdf->Write(0, $validated['domicilation']);

    $devise = match ($validated['valeur_en']) {
        'dinar' => 'Dinars',
        'euro' => 'Euros',
        'dolar' => 'Dollars',
        default => '',
    };
    $pdf->SetXY(152, 110);
    $pdf->Write(0, $devise);

    $rib = preg_replace('/\D/', '', $validated['rib']);

    if (strlen($rib) >= 20) {
        $pdf->SetXY(85, 50);  $pdf->Write(0, substr($rib, 0, 2));
        $pdf->SetXY(108, 50); $pdf->Write(0, substr($rib, 2, 3));
        $pdf->SetXY(130, 50); $pdf->Write(0, substr($rib, 5, 13));
        $pdf->SetXY(200, 50); $pdf->Write(0, substr($rib, 18, 2));

        $pdf->SetXY(8, 118);   $pdf->Write(0, substr($rib, 0, 2));
        $pdf->SetXY(25, 118);  $pdf->Write(0, substr($rib, 2, 3));
        $pdf->SetXY(40, 118);  $pdf->Write(0, substr($rib, 5, 13));
        $pdf->SetXY(118, 118); $pdf->Write(0, substr($rib, 18, 2));
    } else {
        $pdf->SetXY(100, 45);
        $pdf->Write(0, "RIB invalide");
    }

    $pdf->SetXY(160, 30);  $pdf->Write(0, $validated['lieu']);
    $pdf->SetXY(160, 35);  $pdf->Write(0, $validated['date_echeance']);
    $pdf->SetXY(255, 45);  $pdf->Write(0, $validated['montant'] . ' DT');
    $pdf->SetXY(255, 70);  $pdf->Write(0, $validated['montant'] . ' DT');
    $pdf->SetXY(60, 85);   $pdf->Write(0, $validated['ml']);
    $pdf->SetXY(60, 100);  $pdf->Write(0, $validated['date_creation']);
    $pdf->SetXY(10, 100);  $pdf->Write(0, $validated['lieu']);
    $pdf->SetXY(170, 100); $pdf->Write(0, $validated['lieuc']);
    $pdf->SetXY(100, 100); $pdf->Write(0, $validated['date_echeance']);
    $pdf->SetXY(130, 130); $pdf->Write(0, $validated['nd']);
    unlink($tempPath);
    $filename = 'traite_' . Str::uuid() . '.pdf';
    $relativePath = 'traites/' . $filename;
    $absolutePath = storage_path('app/public/' . $relativePath);
    $pdf->Output($absolutePath, 'F');

    $validated['pdf_path'] = $relativePath;
    $traite = Traite::create($validated);

    return response()->json([
        'message' => 'Lettre générée et enregistrée',
        'pdf_url' => asset('storage/' . $relativePath),
        'traite' => $traite
    ], 201);
}

public function store(Request $request)
{
    $validated = $request->validate([
        'user_id' => 'required|exists:users,id',
        'nom' => 'required|string',
        'rib' => 'required|string',
        'date_echeance' => 'required|date',
        'montant' => 'required|numeric',
        'ml' => 'required|string',
        'date_creation' => 'required|date',
        'lieu' => 'required|string',
        'lieuc' => 'required|string',
        'nd' => 'required|string',
        'domicilation' => 'required|string',
        'valeur_en' => 'required|string'
    ]);

    $traite = Traite::create($validated);

    return response()->json($traite, 201);
}
    /* Get all traite user by id */
public function gettraitebyuser($id)
{
    $traites = Traite::where('user_id', $id)->orderBy('created_at', 'desc')->paginate(5); // 5 par page

    return response()->json([
        'total' => $traites->total(),
        'per_page' => $traites->perPage(),
        'current_page' => $traites->currentPage(),
        'last_page' => $traites->lastPage(),
        'traites' => $traites->items()
    ], 200);
}
public function deleteTraite($id)
{
    $traite = Traite::find($id);

    if (!$traite) {
        return response()->json(['message' => 'Lettre de change non trouvée.'], 404);
    }

    // Supprimer le fichier PDF si existant
    if ($traite->pdf_path && file_exists(storage_path('app/public/' . $traite->pdf_path))) {
        unlink(storage_path('app/public/' . $traite->pdf_path));
    }

    $traite->delete();

    return response()->json(['message' => 'Lettre de change supprimée avec succès.']);
}

// get all traite with user  //
public function getAllTraitesWithUsers()
{
    $traites = Traite::with('user')->orderBy('created_at', 'desc')->get();

    return response()->json([
        'success' => true,
        'traites' => $traites
    ]);
}





//// config founisseur ///////
    // Ajouter un config
    public function storeConfig(Request $request)
    {
        $request->validate([
            'fournisseur' => 'required|string|max:255',
            'rib' => 'required|string|max:255',
        ]);

        $config = TraiteConfig::create($request->all());

        return response()->json([
            'message' => 'Configuration enregistrée avec succès',
            'data' => $config
        ], 201);
    }

    // Liste des configs
    public function indexConfig()
    {
        return response()->json(TraiteConfig::all());
    }

    // Supprimer un config
    public function destroyConfig($id)
    {
        $config = TraiteConfig::findOrFail($id);
        $config->delete();

        return response()->json([
            'message' => 'Configuration supprimée avec succès'
        ]);
    }
}
