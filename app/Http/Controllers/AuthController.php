<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;
use App\Models\Pointage;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            // Validation des données
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'sexe' => 'required|string|in:homme,femme',
                'role' => 'required|string|in:administrator,employer,client',
                'password' => 'required|string|confirmed|min:8',
                'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Validation de l'image
            ]);
    
                // Gestion du fichier image
                $profileImagePath = null;
                if ($request->hasFile('profile_image')) {
                    $profileImagePath = $request->file('profile_image')->store('profile_images', 'public');
                }

                // Création de l'utilisateur
                $user = User::create([
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                    'sexe' => $validated['sexe'],
                    'role' => $validated['role'],
                    'password' => Hash::make($validated['password']),
                    'profile_image' => $profileImagePath, // Enregistrement du chemin de l'image
                ]);
    
            // Génération du token
            $token = $user->createToken('MyApp')->plainTextToken;
    
            return response()->json([
                'message' => 'User registered successfully',
                'user' => $user,
                'profile_image_url' => URL::to('/') . '/storage/' . $profileImagePath, // Ajoutez l'URL complète ici
                'token' => $token,
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur dans la méthode register: ' . $e->getMessage());
            return response()->json([
                'message' => 'Une erreur est survenue : ' . $e->getMessage(),
            ], 500);
        }
    }
    /* Get all user  avec  pagination */

    public function getUsers(Request $request)
    {
        $perPage = $request->input('per_page', 3); // Par défaut 3 utilisateurs par page

        // Récupérer tous les utilisateurs pour compter les statuts
        $allUsers = User::with(['pointages' => function ($q) {
            $q->latest('created_at');
        }])->get();

        $statusCounts = [
            'au_bureau' => 0,
            'hors_ligne' => 0,
        ];

        foreach ($allUsers as $user) {
            $lastPointage = $user->pointages->first();
            $status = $lastPointage && $lastPointage->is_active ? 'au_bureau' : 'hors_ligne';
            if ($status === 'au_bureau') {
                $statusCounts['au_bureau']++;
            } else {
                $statusCounts['hors_ligne']++;
            }
        }

        // Paginater les utilisateurs (en récupérant uniquement les utilisateurs de la page actuelle)
        $users = User::paginate($perPage);

        $today = Carbon::today();
        $firstDayOfMonth = $today->copy()->startOfMonth();
        $lastDayOfMonth = $today->copy()->endOfMonth();

        // Fonction pour formater les données de pointage par jour
        $formatDayData = function ($date, $pointages) {
            $dayName = ucfirst(Carbon::parse($date)->locale('fr')->isoFormat('dddd'));
            $monthName = ucfirst(Carbon::parse($date)->locale('fr')->isoFormat('MMMM'));
            $weekNumber = Carbon::parse($date)->weekOfMonth;

            if ($pointages->isEmpty()) {
                return [
                    "date" => $date,
                    "day" => $dayName,
                    "month" => $monthName,
                    "week" => $weekNumber,
                    "arrival_date" => null,
                    "last_departure" => null,
                    "location" => null,
                    "status" => "hors ligne",
                    "total_hours" => "00:00:00",
                    "counter" => 0,
                    "pointages" => [],
                ];
            }

            $firstPointage = $pointages->first();
            $lastPointage = $pointages->last();
            $totalSeconds = $pointages->sum('counter');

            return [
                "date" => $date,
                "day" => $dayName,
                "month" => $monthName,
                "week" => $weekNumber,
                "arrival_date" => Carbon::parse($firstPointage->arrival_date)->format('H:i:s'),
                "last_departure" => Carbon::parse($lastPointage->last_departure)->format('H:i:s'),
                "location" => $lastPointage->location ?? null,
                "status" => $lastPointage && $lastPointage->is_active ? "au bureau" : "hors ligne",
                "total_hours" => gmdate('H:i:s', $totalSeconds),
                "counter" => $totalSeconds,
                "pointages" => $pointages->map(function ($pointage) {
                    return [
                        "id" => $pointage->id,
                        "user_id" => $pointage->user_id,
                        "arrival_date" => Carbon::parse($pointage->arrival_date)->format('H:i:s'),
                        "counter" => $pointage->counter,
                        "last_departure" => Carbon::parse($pointage->last_departure)->format('Y-m-d H:i:s'),
                        "location" => $pointage->location ?? null,
                    ];
                }),
            ];
        };

        // Ajouter les données supplémentaires pour chaque utilisateur paginé
        foreach ($users as $user) {
            $lastPointage = $user->pointages()->latest('created_at')->first();
            $status = $lastPointage && $lastPointage->is_active ? 'au_bureau' : 'hors_ligne';

            $user->profile_image_url = $user->profile_image ? URL::to('/') . '/storage/' . $user->profile_image : null;
            $user->status = $status;
            $user->arrival_date = $lastPointage ? Carbon::parse($lastPointage->arrival_date)->format('H:i:s') : null;
            $user->location = $lastPointage ? $lastPointage->location : null;

            $history = [];
            $totalCounter = 0;

            $pointagesByDay = [];

            // Regrouper les pointages par date
            foreach ($user->pointages as $pointage) {
                $lastDepartureDate = Carbon::parse($pointage->last_departure)->toDateString();

                if (!isset($pointagesByDay[$lastDepartureDate])) {
                    $pointagesByDay[$lastDepartureDate] = [];
                }

                $pointagesByDay[$lastDepartureDate][] = $pointage;
            }

            // Formater les données par jour
            foreach ($pointagesByDay as $date => $pointages) {
                $dayData = $formatDayData($date, collect($pointages));
                $history[] = $dayData;
                $totalCounter += $dayData['counter'];
            }

            $user->counter = $totalCounter;
            $user->history = $history;
        }

        // Retourner la réponse JSON avec les utilisateurs paginés, les statistiques et les historiques
        return response()->json([
            'users' => $users->items(), // Contenu paginé
            'status_counts' => $statusCounts, // Nombre de personnes "au_bureau" et "hors_ligne"
            'current_page' => $users->currentPage(),
            'last_page' => $users->lastPage(),
            'per_page' => $users->perPage(),
            'total' => $users->total(),
        ], 200);
    }


    /* Get all user by id */
   
    public function getUserById($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }
    
        $today = Carbon::today();
        $firstDayOfMonth = $today->copy()->startOfMonth();
        $lastDayOfMonth = $today->copy()->endOfMonth();
    
        // Récupérer les pointages du mois
        $pointages = $user->pointages()
            ->whereBetween('arrival_date', [$firstDayOfMonth, $lastDayOfMonth])
            ->get();
    
        $status = 'hors ligne';
        if (!$pointages->isEmpty()) {
            $status = $pointages->last()->is_active ? 'au bureau' : 'hors ligne';
        }
    
        $user->profile_image_url = $user->profile_image 
            ? URL::to('/') . '/storage/' . $user->profile_image 
            : null;
    
        $user->status = $status;
    
        // Définir la fonction formatDayData ici
        $formatDayData = function ($date, $pointages) {
            $dayName = ucfirst(Carbon::parse($date)->locale('fr')->isoFormat('dddd'));
            $monthName = ucfirst(Carbon::parse($date)->locale('fr')->isoFormat('MMMM'));
            $weekNumber = Carbon::parse($date)->weekOfMonth;
    
            if ($pointages->isEmpty()) {
                return [
                    "date" => $date,
                    "day" => $dayName,
                    "month" => $monthName,
                    "week" => $weekNumber,
                    "arrival_date" => null,
                    "last_departure" => null,
                    "location" => null,
                    "status" => "hors ligne",
                    "total_hours" => "00:00:00",
                    "counter" => 0,
                    "pointages" => [],
                ];
            }
    
            $firstPointage = $pointages->first();
            $lastPointage = $pointages->last();
            $totalSeconds = $pointages->sum('counter');
    
            return [
                "date" => $date,
                "day" => $dayName,
                "month" => $monthName,
                "week" => $weekNumber,
                "arrival_date" => Carbon::parse($firstPointage->arrival_date)->format('H:i:s'),
                "last_departure" => Carbon::parse($lastPointage->last_departure)->format('H:i:s'),
                "location" => $lastPointage->location ?? null,
                "status" => $lastPointage && $lastPointage->is_active ? "aubureau" : "hors ligne",
                "total_hours" => gmdate('H:i:s', $totalSeconds),
                "counter" => $totalSeconds,
                "pointages" => $pointages->map(function ($pointage) {
                    return [
                        "id" => $pointage->id,
                        "user_id" => $pointage->user_id,
                        "arrival_date" => Carbon::parse($pointage->arrival_date)->format('H:i:s'),
                        "counter" => $pointage->counter,
                        "last_departure" => Carbon::parse($pointage->last_departure)->format('Y-m-d H:i:s'),
                        "location" => $pointage->location ?? null,
                    ];
                }),
            ];
        };
    
        $history = [];
        $totalCounter = 0;
    
        if (!$pointages->isEmpty()) {
            // Regrouper les pointages par date
            $pointagesByDay = [];
            foreach ($pointages as $pointage) {
                $date = Carbon::parse($pointage->last_departure)->toDateString();
                if (!isset($pointagesByDay[$date])) {
                    $pointagesByDay[$date] = [];
                }
                $pointagesByDay[$date][] = $pointage;
            }
    
            // Créer l'historique
            foreach ($pointagesByDay as $date => $dayPointages) {
                $dayData = $formatDayData($date, collect($dayPointages));
                $history[] = $dayData;
                $totalCounter += $dayData['counter'];
            }
        }
    
        // Ajouter l'historique et le total
        $user->history = $history;
        $user->counter = $totalCounter;
    
        // Retourner la réponse au format demandé
        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'profile_image_url' => $user->profile_image_url,
                'status' => $user->status,
                'history' => $history,
                'role' => $user->role,
                'sexe' => $user->sexe,
            ]
        ], 200);
    }
     /* * Get  all user  with not pagination*/
     public function getUsersAll(Request $request)
     {
         // Récupérer tous les utilisateurs avec leurs derniers pointages
         $allUsers = User::with(['pointages' => function ($q) {
             $q->latest('created_at');
         }])->get();
     
         $statusCounts = [
             'au_bureau' => 0,
             'hors_ligne' => 0,
         ];
     
         foreach ($allUsers as $user) {
             $lastPointage = $user->pointages->first();
             $status = $lastPointage && $lastPointage->is_active ? 'au_bureau' : 'hors_ligne';
             $statusCounts[$status]++;
         }
     
         $formatDayData = function ($date, $pointages) {
             $dayName = ucfirst(Carbon::parse($date)->locale('fr')->isoFormat('dddd'));
             $monthName = ucfirst(Carbon::parse($date)->locale('fr')->isoFormat('MMMM'));
             $weekNumber = Carbon::parse($date)->weekOfMonth;
     
             if ($pointages->isEmpty()) {
                 return [
                     "date" => $date,
                     "day" => $dayName,
                     "month" => $monthName,
                     "week" => $weekNumber,
                     "arrival_date" => null,
                     "last_departure" => null,
                     "location" => null,
                     "status" => "hors ligne",
                     "total_hours" => "00:00:00",
                     "counter" => 0,
                     "pointages" => [],
                 ];
             }
     
             $firstPointage = $pointages->first();
             $lastPointage = $pointages->last();
             $totalSeconds = $pointages->sum('counter');
     
             return [
                 "date" => $date,
                 "day" => $dayName,
                 "month" => $monthName,
                 "week" => $weekNumber,
                 "arrival_date" => Carbon::parse($firstPointage->arrival_date)->format('H:i:s'),
                 "last_departure" => Carbon::parse($lastPointage->last_departure)->format('H:i:s'),
                 "location" => $lastPointage->location ?? null,
                 "status" => $lastPointage && $lastPointage->is_active ? "au bureau" : "hors ligne",
                 "total_hours" => gmdate('H:i:s', $totalSeconds),
                 "counter" => $totalSeconds,
                 "pointages" => $pointages->map(function ($pointage) {
                     return [
                         "id" => $pointage->id,
                         "user_id" => $pointage->user_id,
                         "arrival_date" => Carbon::parse($pointage->arrival_date)->format('H:i:s'),
                         "counter" => $pointage->counter,
                         "last_departure" => Carbon::parse($pointage->last_departure)->format('Y-m-d H:i:s'),
                         "location" => $pointage->location ?? null,
                     ];
                 }),
             ];
         };
     
         // Ajouter les données supplémentaires pour chaque utilisateur
         foreach ($allUsers as $user) {
             $lastPointage = $user->pointages->first();
             $status = $lastPointage && $lastPointage->is_active ? 'au_bureau' : 'hors_ligne';
     
             $user->profile_image_url = $user->profile_image ? URL::to('/') . '/storage/' . $user->profile_image : null;
             $user->status = $status;
             $user->arrival_date = $lastPointage ? Carbon::parse($lastPointage->arrival_date)->format('H:i:s') : null;
             $user->location = $lastPointage ? $lastPointage->location : null;
     
             $history = [];
             $totalCounter = 0;
             $pointagesByDay = [];
     
             foreach ($user->pointages as $pointage) {
                 $lastDepartureDate = Carbon::parse($pointage->last_departure)->toDateString();
                 $pointagesByDay[$lastDepartureDate][] = $pointage;
             }
     
             foreach ($pointagesByDay as $date => $pointages) {
                 $dayData = $formatDayData($date, collect($pointages));
                 $history[] = $dayData;
                 $totalCounter += $dayData['counter'];
             }
     
             $user->counter = $totalCounter;
             $user->history = $history;
         }
     
         return response()->json([
             'users' => $allUsers,
             'status_counts' => $statusCounts,
         ], 200);
     }
     
     
    /*Delete user */
    
    public function deleteUser($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }

        // Supprimer les pointages liés à l'utilisateur
        $user->pointages()->delete();

        // Supprimer l'utilisateur
        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé avec succès'], 200);
    }
   /*Adresse  */
    
    private function getAddressFromCoordinates($latitude, $longitude)
    {
        // Vérification des coordonnées
        if (!is_numeric($latitude) || !is_numeric($longitude)) {
            return 'Coordonnées invalides';
        }
    
        // Utilisez un cache pour éviter les appels multiples à l'API pour les mêmes coordonnées
        $cacheKey = "address_{$latitude}_{$longitude}";
        $address = Cache::get($cacheKey);
    
        if (!$address) {
            $url = "https://nominatim.openstreetmap.org/reverse?lat={$latitude}&lon={$longitude}&format=json&addressdetails=1";
            try {
                $response = Http::get($url);
                $data = $response->json();
                
                // Vérifier la réponse de l'API
                if (isset($data['address'])) {
                    // Extraire l'adresse complète
                    $address = isset($data['address']['road']) ? $data['address']['road'] : 'Adresse non trouvée';
                } else {
                    $address = 'Aucune adresse trouvée';
                }
    
                // Stocker la réponse dans le cache pendant 10 minutes
                Cache::put($cacheKey, $address, 600);
            } catch (\Exception $e) {
                $address = 'Erreur lors de la récupération de l\'adresse';
            }
        }
    
        return $address;
    }
   
    private function formatDayData($date, $pointages)
    {
        if ($pointages->isEmpty()) {
            return [
                "date" => $date,
                "day" => ucfirst(Carbon::parse($date)->locale('fr')->isoFormat('dddd')),
                "month" => ucfirst(Carbon::parse($date)->locale('fr')->isoFormat('MMMM')),
                "week" => Carbon::parse($date)->weekOfMonth,
                "arrival_date" => null,
                "last_departure" => null,
                "location" => null,
                "status" => "hors ligne",
                "total_hours" => "00:00:00",
                "pointages" => []
            ];
        }

        $firstPointage = $pointages->first();
        $lastPointage = $pointages->last();
        $totalSeconds = $pointages->sum('counter');
        $formattedTotalHours = sprintf('%02d:%02d:%02d', floor($totalSeconds / 3600), floor(($totalSeconds % 3600) / 60), $totalSeconds % 60);

        return [
            "date" => $date,
            "day" => ucfirst(Carbon::parse($date)->locale('fr')->isoFormat('dddd')),
            "month" => ucfirst(Carbon::parse($date)->locale('fr')->isoFormat('MMMM')),
            "week" => Carbon::parse($date)->weekOfMonth,
            "arrival_date" => Carbon::parse($firstPointage->arrival_date)->format('H:i:s'),
            "last_departure" => Carbon::parse($lastPointage->last_departure)->format('H:i:s'),
            "location" => $lastPointage->location ?? null,
            "status" => $lastPointage && $lastPointage->is_active ? "aubureau" : "hors ligne",
            "total_hours" => $formattedTotalHours,
            "pointages" => $pointages->map(function ($pointage) {
                return [
                    "id" => $pointage->id,
                    "user_id" => $pointage->user_id,
                    "arrival_date" => Carbon::parse($pointage->arrival_date)->format('H:i:s'),
                    "counter" => $pointage->counter,
                    "last_departure" => Carbon::parse($pointage->last_departure)->format('Y-m-d H:i:s'),
                    "location" => $pointage->location ?? null,
                ];
            }),
        ];
    }
      // connexion user //
    public function login(Request $request)
    {
        // Validation des données
        $validated = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string|min:8',
        ]);
    
        // Récupérer l'utilisateur par email
        $user = User::where('email', $validated['email'])->first();
    
        // Vérification du mot de passe
        if ($user && Hash::check($validated['password'], $user->password)) {
            // Créer un token Sanctum pour l'utilisateur
            $token = $user->createToken('MyApp')->plainTextToken;
    
            // Retourner le token et les informations de l'utilisateur
            return response()->json([
                'message' => 'Login successful',
                'token' => $token,
                'user' => $user
            ], 200);
        }
    
        // Retourner une erreur si l'authentification échoue
        return response()->json([
            'message' => 'Invalid credentials',
        ], 401);
    }
      // deconnexion user //
    public function logout(Request $request)
    {
        $request->user()->tokens->each(function ($token) {
            $token->delete();
        });

        return response()->json(['message' => 'Logged out successfully']);
    }
   
    // update user //
    public function updateUser(Request $request, $id)
    {
        try {
            // Trouver l'utilisateur ou lever une exception s'il n'existe pas
            $user = User::findOrFail($id);

            // Valider les données reçues
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . $id,
                'sexe' => 'nullable|string|in:homme,femme',
                'role' => 'nullable|string|in:administrator,employer,client',
                'password' => 'nullable|string|min:8|confirmed',
                'profile_image' => 'nullable|string',  // Gérer les images Base64
            ]);

            // Mettre à jour les champs modifiables
            $user->name = $validated['name'];
            $user->email = $validated['email'];
            $user->sexe = $validated['sexe'] ?? $user->sexe;
            $user->role = $validated['role'] ?? $user->role;

            // Mise à jour du mot de passe si fourni
            if ($request->filled('password')) {
                $user->password = bcrypt($validated['password']);
            }

            // Gestion de l'image de profil
            if ($request->filled('profile_image')) {
                // Supprimer l'ancienne image si elle existe
                if ($user->profile_image && file_exists(storage_path('app/public/' . $user->profile_image))) {
                    unlink(storage_path('app/public/' . $user->profile_image));
                }

                // Décoder l'image Base64 et enregistrer le fichier
                $imageData = $request->input('profile_image');
                $image = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $imageData));

                // Générer un nom de fichier unique
                $imageName = uniqid() . '.jpg';
                $path = storage_path('app/public/profile_images/' . $imageName);
                file_put_contents($path, $image);

                // Enregistrer le chemin relatif de l'image dans la base de données
                $user->profile_image = 'profile_images/' . $imageName;
            }

            // Sauvegarder les modifications dans la base de données
            $user->save();

            // Retourner une réponse JSON en cas de succès
            return response()->json([
                'message' => 'User updated successfully',
                'user' => $user,
                'profile_image_url' => $user->profile_image ? URL::to('/') . '/storage/' . $user->profile_image : null,
            ]);
        } catch (\Exception $e) {
            // Gestion des erreurs
            \Log::error('Erreur lors de la mise à jour de l\'utilisateur : ' . $e->getMessage());
            return response()->json([
                'message' => 'Une erreur est survenue : ' . $e->getMessage(),
            ], 500);
        }
    }

    // forgotPassword  user //

    public function forgotPassword(Request $request)
    {
        // Validation des données
        $request->validate([
            'email' => 'required|email|exists:users,email', // Assurez-vous que l'email existe dans la base de données
        ]);

        // Générer un token de réinitialisation
        $token = Str::random(60);

        // Insérer dans la table password_resets
        DB::table('password_resets')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => $token,
                'created_at' => now(),
            ]
        );

        // Construire le lien de réinitialisation avec le token et l'email
        $resetLink = url("http://localhost:4200/reset-password?token=$token&email=" . urlencode($request->email));

        // Envoyer un email avec le lien de réinitialisation
        Mail::send([], [], function ($message) use ($request, $resetLink) {
            $message->to($request->email)
                ->subject('Réinitialisation de votre mot de passe')
                ->setBody('<p>Pour réinitialiser votre mot de passe, <a href="' . $resetLink . '">cliquez ici</a>.</p>', 'text/html');
        });

        return response()->json([
            'message' => 'Un lien de réinitialisation a été envoyé à votre email.'
        ]);
    }

   // resetPassword  user //
    public function resetPassword(Request $request)
    {
        // Validation des champs
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|confirmed|min:8',
        ]);

        // Vérifier le token et l'email dans la table password_resets
        $resetRecord = DB::table('password_resets')
            ->where('token', $request->token)
            ->where('email', $request->email)
            ->first();

        if (!$resetRecord) {
            return response()->json([
                'message' => 'Le lien de réinitialisation est invalide ou expiré.'
            ], 400);
        }

        // Trouver l'utilisateur par email et mettre à jour son mot de passe
        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        // Supprimer le token de la table password_resets après utilisation
        DB::table('password_resets')->where('email', $request->email)->delete();

        return response()->json([
            'message' => 'Mot de passe réinitialisé avec succès.'
        ]);
    }
   // export pointage  user //
    public function exportUserWorkDays(Request $request)
    {
        $selectedMonth = $request->query('month'); // ex: '2025-04'

        if (!$selectedMonth) {
            return response()->json(['message' => 'Mois non sélectionné'], 400);
        }

        // Définir les dates de début et fin du mois
        $firstDay = Carbon::createFromFormat('Y-m', $selectedMonth)->startOfMonth();
        $lastDay  = Carbon::createFromFormat('Y-m', $selectedMonth)->endOfMonth();

        Log::info('Premier jour du mois:', [$firstDay]);
        Log::info('Dernier jour du mois:', [$lastDay]);

        // Nombre total de jours ouvrables dans le mois
        $totalWorkingDays = $firstDay->diffInDaysFiltered(function(Carbon $date) {
            return $date->isWeekday();
        }, $lastDay) + 1;

        // Récupérer les utilisateurs avec leurs pointages du mois uniquement
        $users = User::with(['pointages' => function ($query) use ($firstDay, $lastDay) {
            $query->whereBetween('arrival_date', [$firstDay, $lastDay]);
        }])->get();

        // Définir les en-têtes CSV
        $headers = ['Nom', 'Email', 'Jours de travail', 'Jours d\'absence', 'Total heures'];

        return Response::stream(function () use ($headers, $users, $firstDay, $lastDay, $totalWorkingDays) {
            $handle = fopen('php://output', 'w');

            // BOM pour Excel (UTF-8)
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));

            // Écrire les en-têtes
            fputcsv($handle, $headers, ';');

            foreach ($users as $user) {
                $workDays = 0;
                $totalSeconds = 0;

                // Boucle sur chaque jour du mois
                foreach (new \DatePeriod($firstDay, \DateInterval::createFromDateString('1 day'), $lastDay->copy()->addDay()) as $date) {
                    $dateStr = Carbon::instance($date)->toDateString();

                    // Récupérer les pointages du jour
                    $pointages = $user->pointages->filter(function ($p) use ($dateStr) {
                        return Carbon::parse($p->arrival_date)->toDateString() === $dateStr ||
                            Carbon::parse($p->last_departure)->toDateString() === $dateStr;
                    });

                    if ($pointages->isNotEmpty()) {
                        $workDays++;
                        $totalSeconds += $pointages->sum('counter');
                    }
                }

                // Calcul des jours d'absence
                $absenceDays = $totalWorkingDays - $workDays;
                $absenceDays = max($absenceDays, 0); // pas négatif

                // Écrire la ligne utilisateur
                fputcsv($handle, [
                    $user->name,
                    $user->email,
                    $workDays,
                    $absenceDays,
                    gmdate('H:i:s', $totalSeconds)
                ], ';');
            }

            fclose($handle);
        }, 200, [
            "Content-Type"        => "text/csv; charset=UTF-8",
            "Content-Disposition" => "attachment; filename=rapport_utilisateurs_{$selectedMonth}.csv",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0",
        ]);
    }
   // convert  image //
    private function base64ToImage($base64Image)
    {
        // On suppose que le base64 contient un préfixe "data:image/png;base64,..." ou similaire.
        $parts = explode(',', $base64Image);
        if (count($parts) > 1) {
            return base64_decode(end($parts));
        }
        return base64_decode($base64Image);
    }
 
    // serach user //
    public function searchUsers(Request $request)
{
    $perPage = $request->input('per_page', 3);
    $search = $request->input('search');

    $query = User::query()->with(['pointages' => function ($q) {
        $q->latest('created_at');
    }]);

    // Si une recherche est fournie : filtrer
    if ($search) {
        $query->where(function($q) use ($search) {
            $q->where('name', 'like', '%' . $search . '%')
              ->orWhere('email', 'like', '%' . $search . '%');
        });
    }

    // Paginer les résultats
    $users = $query->paginate($perPage);

    // Calculer les statuts
    $statusCounts = [
        'au_bureau' => 0,
        'hors_ligne' => 0,
    ];

    foreach ($users as $user) {
        $lastPointage = $user->pointages->first();
        $status = $lastPointage && $lastPointage->is_active ? 'au_bureau' : 'hors_ligne';
        $user->status = $status;

        if ($status === 'au_bureau') {
            $statusCounts['au_bureau']++;
        } else {
            $statusCounts['hors_ligne']++;
        }

        $user->profile_image_url = $user->profile_image ? URL::to('/') . '/storage/' . $user->profile_image : null;
        $user->arrival_date = $lastPointage ? Carbon::parse($lastPointage->arrival_date)->format('H:i:s') : null;
        $user->location = $lastPointage ? $lastPointage->location : null;
    }

    return response()->json([
        'users' => $users->items(),
        'status_counts' => $statusCounts,
        'current_page' => $users->currentPage(),
        'last_page' => $users->lastPage(),
        'per_page' => $users->perPage(),
        'total' => $users->total(),
    ], 200);
}

}