<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TraiteConfig extends Model
{
    use HasFactory;

    protected $table = 'traite_configs';

    protected $fillable = [
        'fournisseur',
        'rib',
    ];
}
