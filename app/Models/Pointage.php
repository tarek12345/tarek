<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pointage extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'arrival_date', 'total_hours', 'counter', 'weekly_hours', 'monthly_hours', 'is_active'

    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}