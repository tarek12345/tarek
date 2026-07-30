<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Conversation;
use App\Models\Message;
use App\Events\MessageSent;

class ChatController extends Controller
// fdf
{ 
public function getConversations($userId)
{
    $convs = Conversation::where('user_one_id', $userId)
        ->orWhere('user_two_id', $userId)
        ->with(['messages' => function($q) {
            $q->orderBy('created_at', 'desc');
        }])
        ->withCount(['messages as unread_count' => function ($q) use ($userId) {
            $q->where('receiver_id', $userId)->where('is_read', 0);
        }])
        ->orderBy('updated_at', 'desc') // 🔥 très important
        ->get();

    return response()->json($convs);
}


    // Récupérer tous les messages d’une conversation
    public function getMessages($convId)
    {
        $msgs = Message::where('conversation_id', $convId)
            ->orderBy('created_at')
            ->get();

        return response()->json($msgs);
    }

    // Démarrer une nouvelle conversation
public function startConversation(Request $request)
{
    $conv = Conversation::where(function ($q) use ($request) {
            $q->where('user_one_id', $request->user_one_id)
              ->where('user_two_id', $request->user_two_id);
        })
        ->orWhere(function ($q) use ($request) {
            $q->where('user_one_id', $request->user_two_id)
              ->where('user_two_id', $request->user_one_id);
        })
        ->first();

    if (!$conv) {
        $conv = Conversation::create([
            'user_one_id' => $request->user_one_id,
            'user_two_id' => $request->user_two_id,
        ]);
    }

    return response()->json($conv);
}


    // Envoyer un message
public function sendMessage(Request $request)
{
    try {
        $conversation = Conversation::findOrFail($request->conversation_id);

        $receiver_id = ($conversation->user_one_id == $request->sender_id)
            ? $conversation->user_two_id
            : $conversation->user_one_id;

        $fileUrl = null;
        $fileType = null;

        if ($request->hasFile('file')) {
            $file = $request->file('file');

            // Vérifier qu'il y a bien un fichier valide
            if (!$file->isValid()) {
                return response()->json(['error' => 'Fichier invalide'], 400);
            }

            // Stocker le fichier
            $path = $file->store('chat_files', 'public');

            // Détecter le type
            $type = $file->getMimeType();
            $ext  = strtolower($file->getClientOriginalExtension());

            if (strpos($type, 'image') !== false) {
                $fileType = 'image';
            } elseif (strpos($type, 'video') !== false || $ext === 'mp4') {
                $fileType = 'video';
            } else {
                $fileType = 'document';
            }

            $fileUrl = asset('storage/' . $path);
        }

        // Créer le message (texte ou fichier ou les deux)
        $msg = Message::create([
            'conversation_id' => $request->conversation_id,
            'sender_id'       => $request->sender_id,
            'receiver_id'     => $receiver_id,
            'message'         => $request->message ?? null,
            'file_url'        => $fileUrl,
            'file_type'       => $fileType,
            'is_read'         => 0,
        ]);

        return response()->json($msg);

    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage()
        ], 500);
    }
}
public function getUnreadMessages($userId)
{
    $count = Message::where('receiver_id', $userId)
                    ->where('is_read', 0)
                    ->count();

    return response()->json(['unread' => $count]);
}



public function markAsRead($convId, $userId)
{
    Message::where('conversation_id', $convId)
        ->where('sender_id', '!=', $userId) // seulement ce que j'ai reçu
        ->update(['is_read' => 1]);

    return response()->json(['status' => 'ok']);
}

// chat  from file 
}
