<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Leave;
use App\Models\User;

class LeaveController extends Controller
{
 // create  les congé d'un utilisateur
 public function addLeave(Request $request)
 {
     // Validation des données envoyées
     $validated = $request->validate([
         'start_date' => 'required|date',
         'end_date' => 'required|date|after_or_equal:start_date',
         'reason' => 'required|string|max:255',
         'replacant' => 'nullable|exists:users,id', // Le remplaçant est optionnel
     ]);
 
     try {
         // Créer le congé avec le statut 'pending' (en attente)
         $leave = Leave::create([
             'start_date' => $validated['start_date'],
             'end_date' => $validated['end_date'],
             'reason' => $validated['reason'],
             'replacant' => $validated['replacant'],
             'created_by' => auth()->id(),  // L'utilisateur qui fait la demande
             'status' => 'pending',  // Statut par défaut
         ]);
         
         return response()->json($leave, 201);
     } catch (\Exception $e) {
         // Journaliser l'erreur pour déboguer
         \Log::error('Leave creation error: ' . $e->getMessage());
         return response()->json(['message' => 'Server Error'], 500);
     }
 }
 
 

    // Afficher les congés d'un utilisateur
    public function leavesUser(Request $request, $userId)
    {
        $user = auth()->user();
    
        if ($user->role === 'administrator') {
            $leaves = Leave::with(['creator', 'replacant'])->get();
        } elseif ($user->role === 'employer' && $user->id == $userId) {
            $leaves = Leave::with('replacant')->where('created_by', $user->id)->get();
        } else {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
    
        return response()->json($leaves);
    }
    
    
    
    

    // Supprimer un congé
    public function destroy($id)
    {
        $leave = Leave::find($id);

        // Vérification si le congé existe
        if (!$leave) {
            return response()->json(['error' => 'Leave not found'], 404);
        }

        // Vérification si l'utilisateur actuel est un administrateur ou le créateur du congé
        $user = auth()->user();
        if ($user->role !== 'administrator' && $user->id !== $leave->created_by) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $leave->delete();
        return response()->json(['message' => 'Leave deleted successfully']);
    }

    // Mettre à jour un congé
    public function update(Request $request, $id)
    {
        $leave = Leave::find($id);
    
        if (!$leave) {
            return response()->json(['error' => 'Leave not found'], 404);
        }
    
        $user = auth()->user();
        if ($user->id !== $leave->created_by && $user->role !== 'administrator') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
    
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string|max:255',
            'replacant' => 'nullable|exists:users,id',
        ]);
    
        $leave->update([
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'reason' => $validated['reason'],
            'replacant' => $validated['replacant'] ?? $leave->replacant,
        ]);
    
        return response()->json(['message' => 'Leave updated successfully', 'leave' => $leave]);
    }
    

    // Approuver un congé (réservé à l'administrateur)
    public function approve($id)
    {
        // Trouver le congé par son ID
        $leave = Leave::find($id);
    
        // Vérifier si le congé existe
        if (!$leave) {
            return response()->json(['error' => 'Leave not found'], 404);
        }
    
        // Vérifier que l'utilisateur actuel est un administrateur
        $user = auth()->user();
        if ($user->role !== 'administrator') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
    
        // Mettre à jour le statut du congé en 'approved'
        $leave->status = 'approved';
        $leave->save();
    
        return response()->json(['message' => 'Leave approved']);
    }
    

    // Rejeter un congé (optionnel pour l'administrateur)
    public function reject($id)
    {
        // Trouver le congé par son ID
        $leave = Leave::find($id);
        
        // Vérifier si le congé existe
        if (!$leave) {
            return response()->json(['error' => 'Leave not found'], 404);
        }
        
        // Vérifier que l'utilisateur actuel est un administrateur
        $user = auth()->user();
        if ($user->role !== 'administrator') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        // Mettre à jour le statut du congé en 'rejected'
        $leave->status = 'rejected';
        $leave->save();
        
        return response()->json(['message' => 'Leave rejected']);
    }
    
    
}
