<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Leave extends Model
{
    use HasFactory;

    protected $fillable = [
        'pointage_id', 'start_date', 'end_date', 'reason', 'status'
    ];

    public function pointage()
    {
        return $this->belongsTo(Pointage::class);
    }
}
