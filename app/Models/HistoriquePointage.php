<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistoriquePointage extends Model
{
    use HasFactory;

    protected $table = 'historique_pointages';

    protected $fillable = [
        'user_id', 'nom', 'arrival_date', 'last_departure', 'day', 'week', 'month', 'total_hours','session_duration'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

