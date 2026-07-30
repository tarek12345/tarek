<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = ['conversation_id', 'sender_id', 'message', 'is_read', 'receiver_id',  'file_url',
    'file_type'];

    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }
}
