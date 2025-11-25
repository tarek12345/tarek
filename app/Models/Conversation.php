<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    protected $fillable = ['user_one_id', 'user_two_id'];

    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}
