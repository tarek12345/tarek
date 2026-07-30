<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaixConfig extends Model
{
    use HasFactory;
      protected $table = 'paix_configs';

    protected $fillable = [
   'id',
'nom',
'prenom',
'matricule',
'cin',
'cnss',
'poste',
'entreprise',
'matricule_fiscal',
"created_at",
"updated_at"
    ];
}


  