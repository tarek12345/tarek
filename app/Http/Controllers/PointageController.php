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

    $validated = $request->validate([
        'location' => 'nullable|string',
        'status' => 'nullable|string|in:aubureau,horsligne',
    ]);

    $status = $validated['status'] ?? 'aubureau';
    $location = $validated['location'] ?? 'inconnue';

    $now = Carbon::now();
    $today = $now->toDateString();

    // Désactiver tous les anciens pointages actifs (d'hier ou plus)
    Pointage::where('user_id', $userId)
        ->where('is_active', true)
        ->whereDate('created_at', '!=', $today)
        ->update(['is_active' => false]);

    // Chercher un pointage aujourd'hui
    $existingPointageToday = Pointage::where('user_id', $userId)
        ->whereDate('created_at', $today)
        ->first();

    if ($existingPointageToday) {
        $existingPointageToday->update([
            'arrival_date' => $now->format('H:i:s'),
            'location' => $location,
            'status' => $status,
            'is_active' => true
        ]);

        return response()->json([
            'message' => 'Arrivée mise à jour.',
            'arrival_date' => $existingPointageToday->arrival_date,
            'location' => $existingPointageToday->location,
            'counter' => $existingPointageToday->counter,
        ]);
    }

    // Nouveau pointage pour aujourd'hui
    $lastPointage = Pointage::where('user_id', $userId)->latest()->first();
    $lastCounter = $lastPointage ? $lastPointage->counter : 0;

    $pointage = $user->pointages()->create([
        'arrival_date' => $now->format('H:i:s'),
        'location' => $location,
        'status' => $status,
        'is_active' => true,
        'total_hours' => 0,
        'daily_hours' => 0,
        'monthly_hours' => 0,
        'counter' => 0, // ⚠️ Le compteur commence à 0
    ]);

    return response()->json([
        'message' => 'Nouvelle arrivée enregistrée.',
        'arrival_date' => $pointage->arrival_date,
        'location' => $pointage->location,
        'counter' => $pointage->counter,
    ]);
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
        $sessionSeconds = $departureTime->diffInSeconds($arrivalTime);

        $existingCounter = $activePointage->counter;

        $sessionAlreadyIncluded = $activePointage->last_departure && Carbon::parse($activePointage->last_departure)->gt($arrivalTime);
        $totalSeconds = $sessionAlreadyIncluded ? $existingCounter : $existingCounter + $sessionSeconds;

        $dailyHours = $totalSeconds / 3600;
        $weeklyHours = $user->weekly_hours + ($sessionAlreadyIncluded ? 0 : $sessionSeconds / 3600);
        $monthlyHours = $user->monthly_hours + ($sessionAlreadyIncluded ? 0 : $sessionSeconds / 3600);

        $user->update([
            'daily_hours' => round($dailyHours, 2),
            'weekly_hours' => round($weeklyHours, 2),
            'monthly_hours' => round($monthlyHours, 2),
        ]);

        $formattedDuration = gmdate('H:i:s', $sessionSeconds);

        $activePointage->update([
            'last_departure' => $departureTime->format('Y-m-d H:i:s'),
            'total_hours' => round($totalSeconds / 3600, 2),
            'daily_hours' => round($dailyHours, 2),
            'weekly_hours' => round($weeklyHours, 2),
            'monthly_hours' => round($monthlyHours, 2),
            'counter' => $totalSeconds,
            'is_active' => false,
            'location' => $request->input('location', $activePointage->location),
        ]);

        DB::table('historique_pointages')->insert([
            'user_id' => $userId,
            'nom' => $user->name,
            'arrival_date' => $arrivalTime,
            'last_departure' => $departureTime,
            'day' => $departureTime->translatedFormat('l'),
            'week' => 'Semaine ' . $departureTime->weekOfMonth,
            'month' => $departureTime->translatedFormat('F'),
            'total_hours' => round($totalSeconds / 3600, 2),
            'session_duration' => $formattedDuration,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Départ enregistré avec succès',
            'last_departure' => $departureTime->format('Y-m-d H:i:s'),
            'arrival_date' => $arrivalTime->format('Y-m-d H:i:s'),
            'session_duration' => $formattedDuration,
            'total_hours' => round($totalSeconds / 3600, 2),
            'daily_hours' => round($dailyHours, 2),
            'weekly_hours' => round($weeklyHours, 2),
            'monthly_hours' => round($monthlyHours, 2),
            'counter' => $totalSeconds,
        ], 200);
    }

    public function showHistory($userId)
    {
        try {
            $user = User::find($userId);
            if (!$user) {
                return response()->json(['message' => 'Utilisateur non trouvé'], 404);
            }

            Carbon::setLocale('fr');

            $pointages = Pointage::where('user_id', $userId)
                ->orderBy('arrival_date', 'asc')
                ->get();

            if ($pointages->isEmpty()) {
                return response()->json(['message' => 'Aucun pointage trouvé'], 404);
            }

            $firstDate = Carbon::parse($pointages->first()->arrival_date)->startOfMonth();
            $lastDate = Carbon::parse($pointages->last()->arrival_date)->endOfMonth();

            $joursTravail = [];
            $currentDate = $firstDate->copy();
            $weekNumber = 1;
            $totalMonthlyHours = 0;
            $totalWeeklyHours = 0;

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
                if ($currentDate->format('l') == 'Saturday') {
                    $weekNumber++;
                    $totalWeeklyHours = 0;
                }
            }

            foreach ($pointages as $pointage) {
                $dateKey = Carbon::parse($pointage->arrival_date)->format('Y-m-d');
                if (isset($joursTravail[$dateKey])) {
                    $arrivalTime = Carbon::parse($pointage->arrival_date);
                    $departureTime = $pointage->last_departure ? Carbon::parse($pointage->last_departure) : null;
                    $sessionDuration = $departureTime ? $arrivalTime->diffInSeconds($departureTime) : null;
                    $formattedSessionDuration = $sessionDuration ? gmdate('H:i:s', $sessionDuration) : null;
                    $dailyHours = $sessionDuration ? $sessionDuration / 3600 : 0;
                    $totalMonthlyHours += $dailyHours;
                    $totalWeeklyHours += $dailyHours;

                    $joursTravail[$dateKey] = [
                        'week' => $weekNumber,
                        'month' => $arrivalTime->translatedFormat('F'),
                        'date' => $arrivalTime->format('Y-m-d'),
                        'day' => ucfirst(Carbon::parse($dateKey)->translatedFormat('l')),
                        'arrival_date' => $pointage->arrival_date,
                        'last_departure' => $pointage->last_departure,
                        'session_duration' => $formattedSessionDuration,
                        'total_hours' => gmdate('H:i:s', $totalMonthlyHours * 3600),
                        'daily_hours' => $formattedSessionDuration,
                        'weekly_hours' => round($totalWeeklyHours, 2),
                        'monthly_hours' => round($totalMonthlyHours, 2),
                        'location' => $pointage->location,
                        'status' => $pointage->status,
                    ];
                }
            }

            $result = array_values($joursTravail);

            return response()->json([
                'message' => 'Historique des pointages récupéré avec succès.',
                'data' => $result,
                'weekly_hours' => $totalWeeklyHours,
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Erreur lors de la récupération de l\'historique des pointages : ' . $e->getMessage());
            return response()->json(['message' => 'Erreur serveur', 'error' => $e->getMessage()], 500);
        }
    }

    public function getActiveCounter($userId)
    {
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

        $arrivalTime = Carbon::parse($activePointage->arrival_date);
        $currentTime = Carbon::now();
        $elapsedSeconds = $currentTime->diffInSeconds($arrivalTime);

        $totalSeconds = $activePointage->counter + $elapsedSeconds;

        return response()->json([
            'counter' => $totalSeconds,
            'status' => 'au bureau',
            'daily_hours' => round($activePointage->daily_hours + ($elapsedSeconds / 3600), 2),
            'weekly_hours' => round($activePointage->weekly_hours + ($elapsedSeconds / 3600), 2),
            'monthly_hours' => round($activePointage->monthly_hours + ($elapsedSeconds / 3600), 2),
        ], 200);
    }


public function editPointage(Request $request, $userId, $pointageId)
{
    // Validation des données
    $request->validate([
        'date' => 'required|date',
        'heure_arrivee' => 'nullable|regex:/^\d{2}:\d{2}(:\d{2})?$/',
        'heure_depart' => 'nullable|regex:/^\d{2}:\d{2}(:\d{2})?$/',
    ]);

    \Log::info("Requête reçue pour editPointage : ", $request->all());

    // Chercher le pointage pour cet utilisateur et cet ID
    $pointage = Pointage::where('user_id', $userId)
        ->where('id', $pointageId)
        ->first();

    if (!$pointage) {
        return response()->json(['message' => 'Pointage non trouvé pour cet utilisateur.'], 404);
    }

    // Mise à jour des heures si présentes dans la requête
    if ($request->filled('heure_arrivee')) {
        $pointage->arrival_date = $request->date . ' ' . $request->heure_arrivee;
    }

    if ($request->filled('heure_depart')) {
        $pointage->last_departure = $request->date . ' ' . $request->heure_depart;
    }

    // Calcul et mise à jour de la durée de session
    if ($pointage->arrival_date && $pointage->last_departure) {
        $heureArrivee = strtotime($pointage->arrival_date);
        $heureDepart = strtotime($pointage->last_departure);

        if ($heureDepart > $heureArrivee) {
            $sessionDuration = $heureDepart - $heureArrivee;
            $pointage->counter = $sessionDuration;
        } else {
            return response()->json(['message' => 'Heure de départ doit être après l\'heure d\'arrivée'], 422);
        }
    }

    $pointage->save();

    // Recharger les pointages de l'utilisateur pour recalculer les totaux
    // (You can keep the rest of the logic as is)

    return response()->json(['message' => 'Pointage mis à jour avec succès'], 200);
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