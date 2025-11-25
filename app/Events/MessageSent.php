<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class MessageSent implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $message;

    /**
     * Crée un nouvel événement.
     */
    public function __construct(Message $message)
    {
        $this->message = $message;
    }

    /**
     * Le canal sur lequel l’événement sera diffusé.
     */
    public function broadcastOn()
    {
        // Chaîne privée pour le destinataire
        return new PrivateChannel('chat.' . $this->message->receiver_id);
    }

    /**
     * Nom personnalisé de l’événement côté client
     */
    public function broadcastAs()
    {
        return 'message.sent';
    }
}
