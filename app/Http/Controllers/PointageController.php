<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Pointage;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

    // Mise à jour des totaux journaliers, hebdomadaires et mensuels
    $user->update([
        'daily_hours' => round($dailyHours, 2),
        'weekly_hours' => round($weeklyHours, 2),
        'monthly_hours' => round($monthlyHours, 2),
    ]);

    // Formater la durée de la session en "HH:MM:SS"
    $formattedDuration = gmdate('H:i:s', $totalSeconds);

    // Mettre à jour le pointage, avec la localisation
    $activePointage->update([
        'last_departure' => $departureTime->format('Y-m-d H:i:s'), // 🔥 Assurez-vous qu'il est bien enregistré !
        'total_hours' => round($totalSeconds / 3600, 2),
        'daily_hours' => round($dailyHours, 2),
        'weekly_hours' => round($weeklyHours, 2),
        'monthly_hours' => round($monthlyHours, 2),
        'counter' => $totalSeconds, // Stocker la durée totale en secondes
        'is_active' => false, // Marquer comme inactif
        'location' => $request->input('location', $activePointage->location), // Mettre à jour la localisation si fournie
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
        'location' => $activePointage->location, // Retourner la localisation mise à jour
    ], 200);
}

public function showHistory($userId)
{
    try {
        // Vérifier si l'utilisateur existe
        $user = User::find($userId);
        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }

        // Configurer la locale en français
        Carbon::setLocale('fr'); 

        // Récupérer tous les pointages de l'utilisateur
        $pointages = Pointage::where('user_id', $userId)
            ->orderBy('arrival_date', 'asc') // Trier par date d'arrivée
            ->get();

        // Si aucun pointage trouvé
        if ($pointages->isEmpty()) {
            return response()->json(['message' => 'Aucun pointage trouvé'], 404);
        }

        // Déterminer la plage de dates du mois (premier et dernier jour)
        $firstDate = Carbon::parse($pointages->first()->arrival_date)->startOfMonth();
        $lastDate = Carbon::parse($pointages->last()->arrival_date)->endOfMonth();

        // Générer les jours de travail (lundi à vendredi)
        $joursTravail = [];
        $currentDate = $firstDate->copy();
        $weekNumber = 1;

        // Calculer le nombre d'heures mensuelles et hebdomadaires
        $totalMonthlyHours = 0;
        $totalWeeklyHours = 0;

        // Remplir les jours de travail
        while ($currentDate <= $lastDate) {
            if ($currentDate->isWeekday()) { // Exclure samedi et dimanche
                $joursTravail[$currentDate->format('Y-m-d')] = [
                    'week' => $weekNumber,
                    'month' => $currentDate->translatedFormat('F'),
                    'date' => $currentDate->format('Y-m-d'),
                    'day' => ucfirst($currentDate->translatedFormat('l')),
                    'arrival_date' => "00:00:00", 
                    'last_departure' => null,
                    'session_duration' => null,
                    'total_hours' => null,
                    'daily_hours' => null,
                    'weekly_hours' => $totalWeeklyHours,
                    'monthly_hours' => $totalMonthlyHours,
                    'location' => null,
                    'status' => null,
                ];
            }

            $currentDate->addDay();

            // Vérifiez si la semaine est terminée et mettez à jour le numéro de la semaine
            if ($currentDate->format('l') == 'Saturday') {
                $weekNumber++;
                $totalWeeklyHours = 0; // Réinitialiser les heures de la semaine
            }
        }

        // Vérifier que la semaine ne dépasse pas la limite de 4 semaines pour février
        if ($weekNumber > 4) {
            $weekNumber = 4; // Réinitialiser à 4 si la semaine dépasse le nombre de semaines du mois
        }

        // Remplir les jours avec les données existantes
        foreach ($pointages as $pointage) {
            $dateKey = Carbon::parse($pointage->arrival_date)->format('Y-m-d');

            if (isset($joursTravail[$dateKey])) {
                $arrivalTime = Carbon::parse($pointage->arrival_date);
                $departureTime = $pointage->last_departure ? Carbon::parse($pointage->last_departure) : null;

                // Calcul de la durée de la session
                $sessionDuration = $departureTime ? $arrivalTime->diffInSeconds($departureTime) : null;
                $formattedSessionDuration = $sessionDuration ? gmdate('H:i:s', $sessionDuration) : null;

                // Calcul des heures totales mensuelles et hebdomadaires
                $dailyHours = $sessionDuration ? $sessionDuration / 3600 : 0;
                $totalMonthlyHours += $dailyHours;
                $totalWeeklyHours += $dailyHours;

                // Formater total_hours pour avoir le format H:i:s
                $totalHoursInSeconds = $totalMonthlyHours * 3600;  // Convertir en secondes
                $formattedTotalHours = gmdate('H:i:s', $totalHoursInSeconds);

                $joursTravail[$dateKey] = [
                    'week' => $weekNumber,
                    'month' => $arrivalTime->translatedFormat('F'),
                    'date' => $arrivalTime->format('Y-m-d'),
                    'day' => ucfirst(Carbon::parse($dateKey)->translatedFormat('l')),
                    'arrival_date' => $pointage->arrival_date,
                    'last_departure' => $pointage->last_departure,
                    'session_duration' => $formattedSessionDuration,
                    'total_hours' => $formattedTotalHours,  // Ajout du format H:i:s
                    'daily_hours' => $formattedSessionDuration,
                    'weekly_hours' => $totalWeeklyHours,
                    'monthly_hours' => $totalMonthlyHours,
                    'location' => $pointage->location,
                    'status' => $pointage->status,
                ];
            }
        }

        // Formater la réponse
        $result = array_map(function ($jour) {
            return [
                'week' => $jour['week'],
                'month' => $jour['month'],
                'date' => $jour['date'],
                'day' => $jour['day'],
                'arrival_date' => $jour['arrival_date'],
                'last_departure' => $jour['last_departure'],
                'session_duration' => $jour['session_duration'],
                'total_hours' => $jour['total_hours'],
                'daily_hours' => $jour['daily_hours'],
                'weekly_hours' => $jour['weekly_hours'],
                'monthly_hours' => $jour['monthly_hours'],
                'location' => $jour['location'],
                'status' => $jour['status'],
            ];
        }, $joursTravail);

        return response()->json([
            'message' => 'Historique des pointages récupéré avec succès.',
            'data' => $result,
            'weekly_hours' => $totalWeeklyHours, // Inclure les heures hebdomadaires dans la réponse
        ], 200);

    } catch (\Exception $e) {
        // Capture des erreurs et retour d'un message détaillé
        \Log::error('Erreur lors de la récupération de l\'historique des pointages : ' . $e->getMessage());
        return response()->json(['message' => 'Server Error', 'error' => $e->getMessage()], 500);
    }
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


    public function editPointage(Request $request, $id)
{
    // Valider les données reçues
    $request->validate([
        'date' => 'required|date',
        'heure_arrivee' => 'nullable|regex:/^\d{2}:\d{2}(:\d{2})?$/',
        'heure_depart' => 'nullable|regex:/^\d{2}:\d{2}(:\d{2})?$/',
    ]);

    \Log::info("Requête reçue pour editPointage : ", $request->all());

    // Rechercher le pointage spécifique pour l'utilisateur et la date
    $pointage = Pointage::where('user_id', $id)
        ->where('arrival_date', '=', $request->date . ' ' . $request->heure_arrivee)
        ->first();

    if (!$pointage) {
        return response()->json(['message' => 'Pointage non trouvé pour cette date'], 404);
    }

    // Mise à jour de l'heure d'arrivée et de départ
    if ($request->has('heure_arrivee')) {
        $pointage->arrival_date = $request->date . ' ' . $request->heure_arrivee; // Mise à jour de arrival_date
    }
    if ($request->has('heure_depart')) {
        $pointage->last_departure = $request->date . ' ' . $request->heure_depart; // Mise à jour de last_departure
    }

    // Calcul du total des heures du jour
    if ($pointage->arrival_date && $pointage->last_departure) {
        $heureArrivee = strtotime($pointage->arrival_date);
        $heureDepart = strtotime($pointage->last_departure);
        $pointage->total_hours = ($heureDepart - $heureArrivee) / 3600; // Convertir en heures
    }

    // Sauvegarde des changements
    $pointage->save();

    // Recalculer les heures mensuelles et hebdomadaires après modification
    $user = User::find($id);
    $pointages = Pointage::where('user_id', $id)
        ->orderBy('arrival_date', 'asc')
        ->get();

    // Déterminer la plage de dates du mois (premier et dernier jour)
    $firstDate = Carbon::parse($pointages->first()->arrival_date)->startOfMonth();
    $lastDate = Carbon::parse($pointages->last()->arrival_date)->endOfMonth();

    // Variables pour calculer les heures mensuelles et hebdomadaires
    $totalMonthlyHours = 0;
    $totalWeeklyHours = 0;
    $joursTravail = [];
    $currentDate = $firstDate->copy();
    $weekNumber = 1;

    // Remplir les jours de travail
    while ($currentDate <= $lastDate) {
        if ($currentDate->isWeekday()) {
            $joursTravail[$currentDate->format('Y-m-d')] = [
                'week' => $weekNumber,
                'month' => $currentDate->translatedFormat('F'),
                'date' => $currentDate->format('Y-m-d'),
                'day' => ucfirst($currentDate->translatedFormat('l')),
                'arrival_date' => "00:00:00",
                'last_departure' => null,
                'session_duration' => null,
                'total_hours' => null,
                'daily_hours' => null,
                'weekly_hours' => $totalWeeklyHours,
                'monthly_hours' => $totalMonthlyHours,
                'location' => null,
                'status' => null,
            ];
        }
        $currentDate->addDay();

        // Vérifiez si la semaine est terminée et mettez à jour le numéro de la semaine
        if ($currentDate->format('l') == 'Saturday') {
            $weekNumber++;
            $totalWeeklyHours = 0; // Réinitialiser les heures de la semaine
        }
    }

    // Remplir les jours avec les données existantes
    foreach ($pointages as $pointage) {
        $dateKey = Carbon::parse($pointage->arrival_date)->format('Y-m-d');

        if (isset($joursTravail[$dateKey])) {
            $arrivalTime = Carbon::parse($pointage->arrival_date);
            $departureTime = $pointage->last_departure ? Carbon::parse($pointage->last_departure) : null;

            // Calcul de la durée de la session
            $sessionDuration = $departureTime ? $arrivalTime->diffInSeconds($departureTime) : null;
            $formattedSessionDuration = $sessionDuration ? gmdate('H:i:s', $sessionDuration) : null;

            // Calcul des heures totales mensuelles et hebdomadaires
            $dailyHours = $sessionDuration ? $sessionDuration / 3600 : 0;
            $totalMonthlyHours += $dailyHours;
            $totalWeeklyHours += $dailyHours;

            // Formater total_hours pour avoir le format H:i:s
            $totalHoursInSeconds = $totalMonthlyHours * 3600;  // Convertir en secondes
            $formattedTotalHours = gmdate('H:i:s', $totalHoursInSeconds);

            $joursTravail[$dateKey] = [
                'week' => $weekNumber,
                'month' => $arrivalTime->translatedFormat('F'),
                'date' => $arrivalTime->format('Y-m-d'),
                'day' => ucfirst(Carbon::parse($dateKey)->translatedFormat('l')),
                'arrival_date' => $pointage->arrival_date,
                'last_departure' => $pointage->last_departure,
                'session_duration' => $formattedSessionDuration,
                'total_hours' => $formattedTotalHours,
                'daily_hours' => $formattedSessionDuration,
                'weekly_hours' => $totalWeeklyHours,
                'monthly_hours' => $totalMonthlyHours,
                'location' => $pointage->location,
                'status' => $pointage->status,
            ];
        }
    }

    // Formater la réponse
    $result = array_map(function ($jour) {
        return [
            'week' => $jour['week'],
            'month' => $jour['month'],
            'date' => $jour['date'],
            'day' => $jour['day'],
            'arrival_date' => $jour['arrival_date'],
            'last_departure' => $jour['last_departure'],
            'session_duration' => $jour['session_duration'],
            'total_hours' => $jour['total_hours'],
            'daily_hours' => $jour['daily_hours'],
            'weekly_hours' => $jour['weekly_hours'],
            'monthly_hours' => $jour['monthly_hours'],
            'location' => $jour['location'],
            'status' => $jour['status'],
        ];
    }, $joursTravail);

    return response()->json([
        'message' => 'Pointage mis à jour avec succès',
        'data' => $result,
        'weekly_hours' => $totalWeeklyHours, // Inclure les heures hebdomadaires dans la réponse
    ]);
}

    private function recalculerTotaux($userId, $date)
    {
        // Recalcul du total de la semaine
        $debutSemaine = Carbon::parse($date)->startOfWeek();
        $finSemaine = Carbon::parse($date)->endOfWeek();
        $totalSemaine = Pointage::where('user_id', $userId)
                                ->whereBetween('date', [$debutSemaine, $finSemaine])
                                ->sum('total_jour');
    
        // Recalcul du total du mois
        $debutMois = Carbon::parse($date)->startOfMonth();
        $finMois = Carbon::parse($date)->endOfMonth();
        $totalMois = Pointage::where('user_id', $userId)
                              ->whereBetween('date', [$debutMois, $finMois])
                              ->sum('total_jour');
    
        // Mettre à jour les totaux de l'utilisateur
        User::where('id', $userId)->update([
            'total_semaine' => $totalSemaine,
            'total_mois' => $totalMois,
        ]);
    }
    private function getWorkSchedule($user)
    {
        // Initialiser les jours de la semaine avec le nom des jours
        $daysOfWeek = [
            'lundi' => ['name' => 'Lundi', 'status' => false, 'total_seconds' => 0],
            'mardi' => ['name' => 'Mardi', 'status' => false, 'total_seconds' => 0],
            'mercredi' => ['name' => 'Mercredi', 'status' => false, 'total_seconds' => 0],
            'jeudi' => ['name' => 'Jeudi', 'status' => false, 'total_seconds' => 0],
            'vendredi' => ['name' => 'Vendredi', 'status' => false, 'total_seconds' => 0],
        ];
    
        // Parcourir les pointages et ajouter les durées par jour
        foreach ($user->pointages as $pointage) {
            // Récupérer le jour de la semaine (en français)
            $dayName = Carbon::parse($pointage->created_at)->locale('fr')->dayName;
    
            // Si le jour existe dans notre tableau, mettre à jour les informations
            if (array_key_exists($dayName, $daysOfWeek)) {
                // Mettre à jour le statut du jour en fonction du dernier pointage
                $daysOfWeek[$dayName]['status'] = true;
    
                // Ajouter les secondes totales pour ce jour
                $daysOfWeek[$dayName]['total_seconds'] += $pointage->counter;
            }
        }
    
        // Formater les durées en "HH:MM:SS"
        foreach ($daysOfWeek as $day => $data) {
            $hours = floor($data['total_seconds'] / 3600);
            $minutes = floor(($data['total_seconds'] % 3600) / 60);
            $seconds = $data['total_seconds'] % 60;
    
            // Ajouter un zéro devant les valeurs inférieures à 10
            $formattedTime = sprintf('%02d:%02d:%02d', $hours, $minutes, $seconds);
    
            // Ajouter le temps formaté au tableau
            $daysOfWeek[$day]['formatted_hours'] = $formattedTime;
        }
    
        return $daysOfWeek;
    }
    public function onPause(Request $request, $userId)
{
    $user = User::find($userId);
    if (!$user) {
        return response()->json(['message' => 'Utilisateur non trouvé'], 404);
    }

    // Récupérer le pointage actif
    $activePointage = Pointage::where('user_id', $userId)->where('is_active', true)->first();

    if (!$activePointage) {
        return response()->json(['message' => 'Aucune session active trouvée'], 400);
    }

    // Récupérer le temps de pause en secondes depuis la requête
    $breakTime = $request->input('break_time', 0); // Temps de pause en secondes

    // Ajouter le temps de pause à paid_break
    $activePointage->paid_break += $breakTime; // Ajouter le temps de pause au total des pauses
    $activePointage->save();

    return response()->json([
        'message' => 'Pause enregistrée avec succès',
        'paid_break' => $activePointage->paid_break,
    ], 200);
}
}