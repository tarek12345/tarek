<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Paix extends Model
{

    protected $table = 'paies';


    protected $fillable = [

        'user_id',

        'nom',
        'prenom',
        'matricule',
        'cin',
        'cnss',
        'poste',

        'chef_famille',
        'nombre_enfants',

        'salaire_brut',
        'retenue_cnss',
        'salaire_brut_imposable',
        'retenue_source',
        'contribution_sociale',
        'salaire_net',

        'entreprise',
        'matricule_fiscal',

        'mois',
        'annee',

        'pdf_path'
    ];



    public function user()
    {
        return $this->belongsTo(User::class,'user_id');
    }


}