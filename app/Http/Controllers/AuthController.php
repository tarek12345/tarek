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

    
    public function getUsers()
{
    $users = User::all();
    $today = Carbon::today();
    $firstDayOfMonth = $today->copy()->startOfMonth();
    $lastDayOfMonth = $today->copy()->endOfMonth();

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
                "status" => "horsligne",
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
            "status" => $lastPointage && $lastPointage->is_active ? "aubureau" : "horsligne",
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

    foreach ($users as $user) {
        $lastPointage = $user->pointages()->latest('created_at')->first();
        $status = $lastPointage && $lastPointage->is_active ? 'au bureau' : 'hors ligne';
        $user->profile_image_url = $user->profile_image ? URL::to('/') . '/storage/' . $user->profile_image : null;
        $user->status = $status;
        $user->arrival_date = $lastPointage ? Carbon::parse($lastPointage->arrival_date)->format('H:i:s') : null;
        $user->location = $lastPointage ? $lastPointage->location : null;

        // 🔹 Regrouper les jours par semaines
        $history = [];
        $totalCounter = 0;

        foreach (new \DatePeriod($firstDayOfMonth, \DateInterval::createFromDateString('1 day'), $lastDayOfMonth) as $date) {
            $dateString = Carbon::instance($date)->toDateString(); // Ensure you are using Carbon
            $weekNumber = Carbon::parse($dateString)->weekOfMonth; // Define $weekNumber here
        
            $pointages = $user->pointages()->whereDate('last_departure', $dateString)
                                            ->orWhereDate('arrival_date', $dateString)
                                            ->get();
            $dayData = $formatDayData($dateString, $pointages);

            if (!isset($history[$weekNumber])) {
                $history[$weekNumber] = ["semaine" => $weekNumber, "jours" => []];
            }

            $history[$weekNumber]["jours"][] = $dayData;
            $totalCounter += $dayData['counter'];
        }

        // Ajouter le total des heures
        $user->counter = $totalCounter;
        $user->history = array_values($history); // Réindexer les semaines pour éviter des problèmes d'affichage
    }

    return response()->json(['users' => $users], 200);
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
    

    
    
    

    
    public function getUserById($id)
        {
            $user = User::find($id);
            if (!$user) {
                return response()->json(['message' => 'Utilisateur non trouvé'], 404);
            }
    
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
                        "status" => "horsligne",
                        "total_hours" => "00:00:00",
                        "counter" => 0,
                        "pointages" => [],
                    ];
                }
    
                $firstPointage = $pointages->first();
                $lastPointage = $pointages->last();
    
                $totalSeconds = $pointages->sum('counter');
                $formattedTotalHours = gmdate('H:i:s', $totalSeconds);
    
                return [
                    "date" => $date,
                    "day" => $dayName,
                    "month" => $monthName,
                    "week" => $weekNumber,
                    "arrival_date" => $firstPointage->arrival_date ? Carbon::parse($firstPointage->arrival_date)->format('H:i:s') : null,
                    "last_departure" => $lastPointage->last_departure ? Carbon::parse($lastPointage->last_departure)->format('H:i:s') : null,
                    "location" => $lastPointage->location ?? null,
                    "status" => $lastPointage && $lastPointage->is_active ? "aubureau" : "horsligne",
                    "total_hours" => $formattedTotalHours,
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
    
            // Dernier pointage et statut
            $lastPointage = $user->pointages()->latest('created_at')->first();
            $status = $lastPointage && $lastPointage->is_active ? 'au bureau' : 'hors ligne';
            $user->profile_image_url = $user->profile_image ? URL::to('/') . '/storage/' . $user->profile_image : null;
            $user->status = $status;
            $user->arrival_date = $lastPointage ? Carbon::parse($lastPointage->arrival_date)->format('H:i:s') : null;
            $user->location = $lastPointage ? $lastPointage->location : null;
    
            // Récupération et formattage de l'historique des jours
            $history = [];
            $totalCounter = 0;
    
            // Itération sur chaque jour du mois
            foreach (new \DatePeriod($firstDayOfMonth, \DateInterval::createFromDateString('1 day'), $lastDayOfMonth) as $date) {
                $dateString = Carbon::instance($date)->toDateString(); // Use Carbon instance
                $pointages = $user->pointages()->whereDate('last_departure', $dateString)
                                                ->orWhereDate('arrival_date', $dateString)
                                                ->get();
                $dayData = $formatDayData($dateString, $pointages);
                $history[] = $dayData;
    
                // Ajout du total du counter pour chaque jour
                $totalCounter += $dayData['counter'];
            }
    
            // Ajouter le total du counter sous l'utilisateur
            $user->counter = $totalCounter;
    
            // Ajouter l'historique des jours
            $user->history = [
                "semaine" => 1,
                "jours" => $history,
            ];
    
            return response()->json(['user' => $user], 200);
        }
    
        // Méthode pour ajouter un pointage
        public function addPointage(Request $request, $userId)
        {
            $user = User::find($userId);
            if (!$user) {
                return response()->json(['message' => 'Utilisateur non trouvé'], 404);
            }
    
            $validated = $request->validate([
                'arrival_date' => 'required|date_format:H:i:s',
                'last_departure' => 'nullable|date_format:H:i:s',
                'location' => 'nullable|string',
            ]);
    
            $arrivalDate = Carbon::parse($validated['arrival_date']);
            $lastDeparture = isset($validated['last_departure']) ? Carbon::parse($validated['last_departure']) : null;
            $location = $validated['location'];
    
                // Si le pointage est pour un jour passé, assurez-vous que la date est correcte
            if ($arrivalDate->isToday()) {
                $pointageDate = Carbon::today();  // Ne changez la date que si elle est bien du jour.
            } else {
                $pointageDate = Carbon::parse($validated['arrival_date']);  // Gardez la date envoyée par l'utilisateur.
            }
    
            $pointage = new Pointage();
            $pointage->user_id = $user->id;
            $pointage->arrival_date = $arrivalDate;
            $pointage->last_departure = $lastDeparture;
            $pointage->location = $location;
            $pointage->save();
    
            return response()->json(['message' => 'Pointage ajouté avec succès'], 201);
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
            "status" => "horsligne",
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
        "status" => $lastPointage && $lastPointage->is_active ? "aubureau" : "horsligne",
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






public function exportUserWorkDays(Request $request)
{
    // Nombre total de jours ouvrables dans le mois (ex: 22 jours)
    $totalWorkingDays = 22;

    // Récupérer tous les utilisateurs avec leurs pointages
    $users = User::with('pointages')->get();

    // Définir la plage de dates du mois en cours
    $today = Carbon::today();
    $firstDay = $today->copy()->startOfMonth();
    $lastDay = $today->copy()->endOfMonth();

    // En-têtes du fichier CSV
    $headers = ['Nom', 'Email', 'Jours de travail', 'Jours d\'absence', 'Total heures'];

    return Response::stream(function () use ($headers, $users, $firstDay, $lastDay, $totalWorkingDays) {
        // Ouvrir le fichier en mode écriture
        $handle = fopen('php://output', 'w');

        // Ajouter un BOM (Byte Order Mark) pour garantir que Excel l'ouvre en UTF-8
        fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));

        // Ajouter les en-têtes dans le fichier CSV (séparées par des virgules)
        fputcsv($handle, $headers, ';');  // Utilisation du point-virgule comme séparateur

        // Parcourir chaque utilisateur
        foreach ($users as $user) {
            // Calcul des jours travaillés et des secondes totales pour chaque utilisateur
            $workDays = 0;
            $totalSeconds = 0;

            // Vérification des jours de travail pour chaque jour du mois
            foreach (new \DatePeriod($firstDay, \DateInterval::createFromDateString('1 day'), $lastDay->copy()->addDay()) as $date) {
                $dateStr = Carbon::instance($date)->toDateString();

                // Récupérer les pointages pour chaque jour spécifique
                $pointages = $user->pointages
                    ->filter(function ($p) use ($dateStr) {
                        return Carbon::parse($p->arrival_date)->toDateString() === $dateStr ||
                               Carbon::parse($p->last_departure)->toDateString() === $dateStr;
                    });

                // Si l'utilisateur a pointé ce jour-là, on incrémente les jours de travail
                if ($pointages->isNotEmpty()) {
                    $workDays++;
                    $totalSeconds += $pointages->sum('counter');
                }
            }

            // Calculer les jours d'absence
            $absenceDays = $totalWorkingDays - $workDays;

            // Ajouter une ligne pour chaque utilisateur dans le fichier CSV
            fputcsv($handle, [
                $user->name,
                $user->email,
                $workDays,
                max($absenceDays, 0),  // Jours d'absence ne peut pas être négatif
                gmdate('H:i:s', $totalSeconds)  // Format d'heure : H:i:s
            ], ';');  // Utiliser un point-virgule pour séparer les valeurs dans Excel
        }

        fclose($handle);  // Fermer le fichier
    }, 200, [
        "Content-Type" => "text/csv; charset=UTF-8",  // Le type MIME du fichier CSV
        "Content-Disposition" => "attachment; filename=rapport_utilisateurs.csv",  // Nom du fichier téléchargé
        "Pragma" => "no-cache",
        "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
        "Expires" => "0",
    ]);
}




}
