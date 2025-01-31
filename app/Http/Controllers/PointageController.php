<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Pointage;
use Carbon\Carbon;
use Illuminate\Http\Request;

class PointageController extends Controller
{
    public function onArrival(Request $request, $userId)
    {
        $user = User::find($userId);
        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }
      // Réinitialiser les totaux journaliers, hebdomadaires et mensuels
      $user->update([
        'daily_hours' => 0,
        'weekly_hours' => 0,
        'monthly_hours' => 0,
    ]);
        $validated = $request->validate([
            'location' => 'nullable|string',
            'status' => 'nullable|string|in:aubureau,horsligne',
        ]);
    
        $status = $validated['status'] ?? 'aubureau';
    
        // Fermer toutes les sessions actives existantes
        Pointage::where('user_id', $userId)->where('is_active', true)->update(['is_active' => false]);
    
        // Récupérer la dernière valeur du compteur
        $lastPointage = Pointage::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->first();
    
        $counter = $lastPointage ? $lastPointage->counter : 0; // Démarrer à partir de la dernière valeur
    
        // Enregistrez l'heure réelle de l'arrivée
        $arrivalTime = Carbon::now()->format('H:i:s');
    
        $pointage = $user->pointages()->create([
            'arrival_date' => $arrivalTime,
            'location' => $validated['location'] ?? 'inconnue',
            'status' => $status,
            'is_active' => true,
            'total_hours' => 0,
            'daily_hours' => 0, // Initialiser les heures quotidiennes
            'monthly_hours' => 0, // Initialiser les heures mensuelles
            'counter' => $counter, // Utiliser la dernière valeur du compteur
        ]);
    
        return response()->json([
            'message' => 'Arrivée enregistrée avec succès.',
            'arrival_date' => $pointage->arrival_date,
            'location' => $pointage->location,
            'total_hours' => $pointage->total_hours,
            'counter' => $pointage->counter,
        ], 201);
    }
    
    public function onDeparture(Request $request, $userId)
    {
        $user = User::find($userId);
        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }
    
        $activePointage = Pointage::where('user_id', $userId)->where('is_active', true)->first();
    
        if (!$activePointage) {
            return response()->json(['message' => 'Aucune session active trouvée'], 400);
        }
    
        $departureTime = Carbon::now();
        $arrivalTime = Carbon::parse($activePointage->arrival_date);
    
        // Calculer le temps écoulé durant cette session
        $sessionSeconds = $departureTime->diffInSeconds($arrivalTime);
    
        // Ajouter les heures travaillées au total existant
        $totalSeconds = $activePointage->counter + $sessionSeconds;
    
        // Calculer les heures quotidiennes, hebdomadaires et mensuelles
        $dailyHours = $activePointage->daily_hours + ($sessionSeconds / 3600);
        $weeklyHours = $activePointage->weekly_hours + ($sessionSeconds / 3600);
        $monthlyHours = $activePointage->monthly_hours + ($sessionSeconds / 3600);
        // Vérifier si l'utilisateur a dépassé le total des heures travaillées autorisées
        if ($dailyHours > 8) {
            // Déconnecter l'utilisateur
            $user->tokens()->delete();
            return response()->json([
                'message' => 'Vous avez dépassé le total des heures travaillées autorisées. Vous avez été déconnecté.',
            ], 401);
        }
        // Mettre à jour les totaux journaliers, hebdomadaires et mensuels dans la base de données
        $user->update([
            'daily_hours' => $dailyHours,
            'weekly_hours' => $weeklyHours,
            'monthly_hours' => $monthlyHours,
        ]);
    
        // Formater la durée de la session en "HH:MM:SS"
        $formattedDuration = gmdate('H:i:s', $totalSeconds);
    
        // Mettre à jour le pointage
        $activePointage->update([
            'last_departure' => $departureTime,
            'total_hours' => round($totalSeconds / 3600, 2),
            'daily_hours' => round($dailyHours, 2),
            'weekly_hours' => round($weeklyHours, 2),
            'monthly_hours' => round($monthlyHours, 2),
            'counter' => $totalSeconds, // Stocker la durée totale en secondes
            'is_active' => false, // Marquer comme inactif
        ]);
    
        return response()->json([
            'message' => 'Départ enregistré avec succès',
            'last_departure' => $departureTime->format('Y-m-d H:i:s'),
            'arrival_date' => $arrivalTime->format('Y-m-d H:i:s'),
            'session_duration' => $formattedDuration, // Retourner la durée formatée
            'total_hours' => round($totalSeconds / 3600, 2),
            'daily_hours' => round($dailyHours, 2),
            'weekly_hours' => round($weeklyHours, 2),
            'monthly_hours' => round($monthlyHours, 2),
            'totalTime' => $totalSeconds, // Retourner la durée totale en secondes
        ], 200);
    }


    public function showHistory($userId)
    {
        $user = User::find($userId);
        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }

        $pointages = Pointage::where('user_id', $userId)
            ->orderBy('arrival_date', 'desc')
            ->get();

        if ($pointages->isEmpty()) {
            return response()->json(['message' => 'Aucun pointage trouvé'], 404);
        }

        return response()->json([
            'message' => 'Historique des pointages récupéré avec succès.',
            'data' => $pointages,
        ], 200);
    }

    public function getActiveCounter($userId)
    {
        // Récupérer le dernier pointage actif de l'utilisateur
        $activePointage = Pointage::where('user_id', $userId)
            ->where('is_active', true)
            ->first();
    
        if (!$activePointage) {
            return response()->json([
                'counter' => 0,
                'status' => 'hors ligne',
                'daily_hours' => 0,
                'weekly_hours' => 0,
                'monthly_hours' => 0,
            ], 200);
        }
    
        // Calculer le temps écoulé depuis l'arrivée
        $arrivalTime = Carbon::parse($activePointage->arrival_date);
        $currentTime = Carbon::now();
        $elapsedSeconds = $currentTime->diffInSeconds($arrivalTime);
    
        // Ajouter le temps écoulé au compteur existant
        $totalSeconds = $activePointage->counter + $elapsedSeconds;
        // Calculer les heures quotidiennes, hebdomadaires et mensuelles
        $dailyHours = $activePointage->daily_hours + ($elapsedSeconds / 3600);
        $weeklyHours = $activePointage->weekly_hours + ($elapsedSeconds / 3600);
        $monthlyHours = $activePointage->monthly_hours + ($elapsedSeconds / 3600);
    
        return response()->json([
            'counter' => $totalSeconds,
            'status' => 'au bureau',
            'daily_hours' => round($dailyHours, 2),
            'weekly_hours' => round($weeklyHours, 2),
            'monthly_hours' => round($monthlyHours, 2),
        ], 200);
    }
}