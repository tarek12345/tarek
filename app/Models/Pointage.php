<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pointage extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'arrival_date',
        'last_departure',
        'location',
        'status',
        'is_active',
        'total_hours',
        'counter',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}