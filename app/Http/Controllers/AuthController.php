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
    use Illuminate\Support\Facades\Http;
    use Illuminate\Support\Facades\Cache;


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
    
    
    // public function getUsers()
    // {
    //     // Récupérer tous les utilisateurs
    //     $users = User::all();
        
    //     foreach ($users as $user) {
    //         // Récupérer le dernier pointage de l'utilisateur
    //         $lastPointage = $user->pointages()->latest('created_at')->first();
            
    //         // Déterminer le statut basé sur le dernier pointage
    //         $status = 'hors ligne'; // Statut par défaut
    //         if ($lastPointage) {
    //             $status = $lastPointage->is_active ? 'au bureau' : 'hors ligne';
    //         }
    
    //         // Ajouter les informations supplémentaires
    //         $user->profile_image_url = $user->profile_image 
    //             ? URL::to('/') . '/storage/' . $user->profile_image 
    //             : null;
    //         $user->status = $status;
    
    //         // Ajouter les éléments supplémentaires du pointage (s'ils existent)
    //         $user->arrival_date = $lastPointage ? $lastPointage->arrival_date : null;
    //         $user->location = $lastPointage ? $lastPointage->location : null;
    //         $user->total_hours = $lastPointage ? $lastPointage->total_hours : 0; // Par défaut 0
    //     }
        
    //     // Retourner la réponse avec les utilisateurs et leurs informations supplémentaires
    //     return response()->json([
    //         'users' => $users
    //     ], 200);
    // }
    
    public function getUsers()
    {
        $users = User::all();
        
        foreach ($users as $user) {
            $lastPointage = $user->pointages()->latest('created_at')->first();
            $status = 'hors ligne';
        
            if ($lastPointage) {
                $status = $lastPointage->is_active ? 'au bureau' : 'hors ligne';
            }
    
            $user->profile_image_url = $user->profile_image ? URL::to('/') . '/storage/' . $user->profile_image : null;
            $user->status = $status;
            $user->arrival_date = $lastPointage ? $lastPointage->arrival_date : null;
            $user->location = $lastPointage ? $lastPointage->location : null;
            $user->total_hours = $lastPointage ? $lastPointage->total_hours : 0;
            $user->counter = $lastPointage ? $lastPointage->counter : 0;
            $user->weekly_hours = $lastPointage ? $lastPointage->weekly_hours : 0; 
            $user->monthly_hours = $lastPointage ? $lastPointage->monthly_hours : 0; 
            $user->session_duration = $lastPointage ? gmdate('H:i:s', $lastPointage->counter) : '00:00:00'; // Formater counter en HH:MM:SS
    
            // Ajouter le nom du jour (day_name)
            $dayName = Carbon::today()->locale('fr')->isoFormat('dddd'); // Exemple: lundi, mardi
            $user->day_name = ucfirst($dayName);  // Capitalisation du nom du jour
    
            // Ajouter le total des heures travaillées aujourd'hui (total_hours_today) au format HH:MM:SS
            $today = Carbon::today()->format('Y-m-d');
            $pointagesToday = Pointage::where('user_id', $user->id)
                ->whereDate('arrival_date', '=', $today)
                ->get();
    
            $totalSecondsToday = 0;
            foreach ($pointagesToday as $pointage) {
                $totalSecondsToday += $pointage->counter;
            }
    
            // Convertir les secondes totales en heures, minutes et secondes
            $hours = floor($totalSecondsToday / 3600);
            $minutes = floor(($totalSecondsToday % 3600) / 60);
            $seconds = $totalSecondsToday % 60;
    
            // Formater en HH:MM:SS
            $user->total_hours_today = sprintf('%02d:%02d:%02d', $hours, $minutes, $seconds);
        }
        
        return response()->json(['users' => $users], 200);
    }
    
    
    
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
        try {
            // Récupérer l'utilisateur par son ID
            $user = User::findOrFail($id);
    
            // Ajouter l'URL complète de l'image de profil
            $user->profile_image_url = $user->profile_image ? URL::to('/') . '/storage/' . $user->profile_image : null;
    
            // Récupérer le dernier pointage de l'utilisateur
            $lastPointage = $user->pointages()->latest('created_at')->first();
    
            // Déterminer le statut de l'utilisateur
            $status = 'hors ligne';
            if ($lastPointage) {
                $status = $lastPointage->is_active ? 'au bureau' : 'hors ligne';
            }
    
            // Ajouter les informations supplémentaires à l'utilisateur
            $user->status = $status;
            $user->arrival_date = $lastPointage ? $lastPointage->arrival_date : null;
            $user->location = $lastPointage ? $lastPointage->location : null;
            $user->total_hours = $lastPointage ? $lastPointage->total_hours : 0;
            $user->counter = $lastPointage ? $lastPointage->counter : 0;
            $user->weekly_hours = $lastPointage ? $lastPointage->weekly_hours : 0;
            $user->monthly_hours = $lastPointage ? $lastPointage->monthly_hours : 0;
            $user->session_duration = $lastPointage ? gmdate('H:i:s', $lastPointage->counter) : '00:00:00';
    
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
    
            // Ajouter le tableau des jours de la semaine dans la réponse
            $user->work_schedule = $daysOfWeek;
    
            return response()->json(['user' => $user], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }
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


}
