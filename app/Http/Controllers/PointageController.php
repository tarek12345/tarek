<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Pointage;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class PointageController extends Controller
{
        /* api  arrive */
        public function onArrival(Request $request, $userId)
        {
            // Trouver l'utilisateur
            $user = User::find($userId);
            if (!$user) {
                return response()->json(['message' => 'Utilisateur non trouvé'], 404);
            }
        
            $now = Carbon::now();
            $today = $now->toDateString();
        
            // Vérifier s'il y a un pointage actif
            $lastPointage = $user->pointages()->latest('created_at')->first();
        
            if ($lastPointage) {
                $lastPointageDate = Carbon::parse($lastPointage->arrival_date)->toDateString();
        
                // Si le dernier pointage n'est pas d'aujourd'hui, enregistrer un départ automatique
                if ($lastPointageDate < $today) {
                    $departureTime = Carbon::parse($lastPointageDate . ' 23:59:59'); // Fin de journée
        
                    // Calcul du temps écoulé
                    $sessionSeconds = $departureTime->diffInSeconds(Carbon::parse($lastPointage->arrival_date));
                    $totalSeconds = $lastPointage->counter + $sessionSeconds;
        
                    // Mettre à jour le pointage précédent avec une heure de départ automatique
                    $lastPointage->update([
                        'last_departure' => $departureTime->format('Y-m-d H:i:s'),
                        'total_hours' => round($totalSeconds / 3600, 2),
                        'counter' => $totalSeconds,
                        'is_active' => false, // Marquer comme inactif
                    ]);
        
                    // Ajouter à l'historique
                    DB::table('historique_pointages')->insert([
                        'user_id' => $userId,
                        'nom' => $user->name,
                        'arrival_date' => $lastPointage->arrival_date,
                        'last_departure' => $departureTime,
                        'day' => $departureTime->translatedFormat('l'),
                        'week' => 'Semaine ' . $departureTime->weekOfMonth,
                        'month' => $departureTime->translatedFormat('F'),
                        'total_hours' => round($totalSeconds / 3600, 2),
                        'session_duration' => gmdate('H:i:s', $totalSeconds),
                        'updated_at' => now(),
                        'created_at' => now(),
                    ]);
                }
            }
        
            // Réinitialiser les totaux journaliers, hebdomadaires et mensuels
            $user->update([
                'daily_hours' => 0,
                'weekly_hours' => 0,
                'monthly_hours' => 0,
            ]);
        
            // Validation de la requête
            $validated = $request->validate([
                'location' => 'nullable|string',
                'status' => 'nullable|string|in:aubureau,horsligne',
            ]);
        
            $status = $validated['status'] ?? 'aubureau';
        
            // Fermer toutes les sessions actives existantes
            Pointage::where('user_id', $userId)->where('is_active', true)->update(['is_active' => false]);
        
            // Initialisation du compteur à zéro
            $counter = 0;
        
            // Enregistrer l'heure réelle de l'arrivée
            $arrivalTime = Carbon::now()->format('H:i:s');
        
            // Enregistrer le pointage
            $pointage = $user->pointages()->create([
                'arrival_date' => $arrivalTime,
                'location' => $validated['location'] ?? 'inconnue',
                'status' => $status,
                'is_active' => true,
                'total_hours' => 0,
                'daily_hours' => 0,
                'weekly_hours' => 0,
                'monthly_hours' => 0,
                'counter' => $counter, // Compteur réinitialisé
            ]);
        
            return response()->json([
                'message' => 'Arrivée enregistrée avec succès.',
                'arrival_date' => $pointage->arrival_date,
                'location' => $pointage->location,
                'counter' => $pointage->counter,
            ], 201);
        }
    
        /* api  depart */
        public function onDeparture(Request $request, $userId)
        {
            // Trouver l'utilisateur
            $user = User::find($userId);
            if (!$user) {
                return response()->json(['message' => 'Utilisateur non trouvé'], 404);
            }

            // Trouver la session active de l'utilisateur
            $activePointage = Pointage::where('user_id', $userId)->where('is_active', true)->first();

            if (!$activePointage) {
                return response()->json(['message' => 'Aucune session active trouvée'], 400);
            }

            // Enregistrer l'heure de départ
            $departureTime = Carbon::now();
            $arrivalTime = Carbon::parse($activePointage->arrival_date);

            // Calculer le temps écoulé durant cette session
            $sessionSeconds = $departureTime->diffInSeconds($arrivalTime);

            // Calculer les heures totales, journalières, hebdomadaires et mensuelles
            $totalSeconds = $activePointage->counter + $sessionSeconds;
            $dailyHours = $activePointage->daily_hours + ($sessionSeconds / 3600);
            $weeklyHours = $activePointage->weekly_hours + ($sessionSeconds / 3600);
            $monthlyHours = $activePointage->monthly_hours + ($sessionSeconds / 3600);

            // Mise à jour des heures dans l'utilisateur
            $user->update([
                'daily_hours' => round($dailyHours, 2),
                'weekly_hours' => round($weeklyHours, 2),
                'monthly_hours' => round($monthlyHours, 2),
            ]);

            // Mise à jour du pointage avec le temps calculé
            $activePointage->update([
                'last_departure' => $departureTime->format('Y-m-d H:i:s'),
                'total_hours' => round($totalSeconds / 3600, 2),
                'daily_hours' => round($dailyHours, 2),
                'weekly_hours' => round($weeklyHours, 2),
                'monthly_hours' => round($monthlyHours, 2),
                'counter' => $totalSeconds, // Mise à jour du compteur
                'is_active' => false, // Marquer comme inactif
                'location' => $request->input('location', $activePointage->location), // Mise à jour de la localisation
            ]);

            // Enregistrement dans l'historique
            // Format de la durée de la session (HH:MM:SS)
                $formattedDuration = gmdate('H:i:s', $totalSeconds);
                // Insérer dans l'historique
                DB::table('historique_pointages')->insert([
                    'user_id' => $userId,
                    'nom' => $user->name,
                    'arrival_date' => $arrivalTime,
                    'last_departure' => $departureTime,
                    'day' => $departureTime->translatedFormat('l'), // Ex: Mardi
                    'week' => 'Semaine ' . $departureTime->weekOfMonth,
                    'month' => $departureTime->translatedFormat('F'), // Ex: Mars
                    'total_hours' => round($totalSeconds / 3600, 2),
                    'session_duration' => $formattedDuration, // Durée de la session ajoutée ici
                    'updated_at' => now(),
                    'created_at' => now(),
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
                'counter' => $totalSeconds, // Durée totale en secondes
                'location' => $activePointage->location,
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
            ->whereDate('arrival_date', $request->date)
            ->first();
    
        // Si le pointage n'existe pas, on le crée
        if (!$pointage) {
            $pointage = new Pointage();
            $pointage->user_id = $id;
            $pointage->arrival_date = $request->date . ' ' . $request->heure_arrivee;
            $pointage->last_departure = $request->date . ' ' . $request->heure_depart;
    
            // Calcul du total des heures
            if ($pointage->arrival_date && $pointage->last_departure) {
                $heureArrivee = Carbon::parse($pointage->arrival_date);
                $heureDepart = Carbon::parse($pointage->last_departure);
                $pointage->total_hours = $heureArrivee->diffInHours($heureDepart);
            }
    
            $pointage->counter = $pointage->total_hours * 3600;  // Stocke le total en secondes
            $pointage->save();
    
            return response()->json([
                'message' => 'Nouveau pointage créé avec succès',
                'data' => $pointage,
            ]);
        }
    
        // Si le pointage existe, on le met à jour
        try {
            if ($request->filled('heure_arrivee')) {
                $pointage->arrival_date = $request->date . ' ' . $request->heure_arrivee;
            }
            if ($request->filled('heure_depart')) {
                $pointage->last_departure = $request->date . ' ' . $request->heure_depart;
            }
    
            // Calcul du total des heures
            if ($pointage->arrival_date && $pointage->last_departure) {
                $heureArrivee = Carbon::parse($pointage->arrival_date);
                $heureDepart = Carbon::parse($pointage->last_departure);
                $pointage->total_hours = $heureArrivee->diffInHours($heureDepart);
            }
    
            // Calcul du total en secondes
            $pointage->counter = $pointage->total_hours * 3600;
            $pointage->save();
    
            return response()->json([
                'message' => 'Pointage mis à jour avec succès',
                'data' => $pointage,
            ]);
        } catch (\Exception $e) {
            \Log::error("Erreur lors de la mise à jour du pointage: " . $e->getMessage());
            return response()->json(['message' => 'Erreur serveur'], 500);
        }
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