<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Leave extends Model
{
    use HasFactory;

    protected $fillable = [
        'pointage_id',
        'start_date',
        'end_date',
        'reason',
        'status',
        'created_by',
        'replacant',
    ];

    /**
     * Relation avec le pointage (optionnelle)
     */
    public function pointage()
    {
        return $this->belongsTo(Pointage::class);
    }

    /**
     * Utilisateur qui a créé le congé
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Utilisateur remplaçant
     */
    public function replacant()
    {
        return $this->belongsTo(User::class, 'replacant');
    }
}
