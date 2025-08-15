<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Traite extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'pdf_path',
        'nom',
        'rib',
        'date_echeance',
        'montant',
        'ml',
        'date_creation',
        'lieu',
        'lieuc',
        'jours_restants',
        'nd',
        'domicilation',
        'valeur_en',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    protected static function boot()
{
    parent::boot();

    static::creating(function ($traite) {
        if ($traite->date_creation && $traite->date_echeance) {
            $traite->jours_restants = now()->parse($traite->date_echeance)->diffInDays($traite->date_creation);
        }
    });

    static::updating(function ($traite) {
        if ($traite->date_creation && $traite->date_echeance) {
            $traite->jours_restants = now()->parse($traite->date_echeance)->diffInDays($traite->date_creation);
        }
    });
}

}
