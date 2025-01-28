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
            $user->session_duration = $lastPointage ? gmdate('H:i:s', $lastPointage->counter) : '00:00:00'; // Formater counter en HH:MM:SS
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
    




    // user by id 

    public function getUserById($id)
    {
        try {
            // Récupérer l'utilisateur par son ID
            $user = User::findOrFail($id);
    
            // Ajouter l'URL complète de l'image de profil
            if ($user->profile_image) {
                $user->profile_image_url = URL::to('/') . '/storage/' . $user->profile_image;
            }
    
            // Récupérer le dernier pointage de l'utilisateur
            $lastPointage = $user->pointages()
                ->latest('created_at')
                ->first();
    
            // Ajouter les informations du pointage à l'utilisateur
            if ($lastPointage) {
                $user->status = $lastPointage->is_active ? 'au bureau' : 'hors ligne';
                $user->arrival_date = $lastPointage->arrival_date;
                $user->location = $lastPointage->location;
                $user->total_hours = $lastPointage->total_hours;
                $user->counter = $lastPointage->counter;
                $user->session_duration = gmdate('H:i:s', $lastPointage->counter); // Formater le compteur en HH:MM:SS
            } else {
                $user->status = 'hors ligne'; // Statut inactif par défaut
                $user->arrival_date = null;
                $user->location = null;
                $user->total_hours = 0;
                $user->counter = 0;
                $user->session_duration = '00:00:00';
            }
    
            return response()->json(['user' => $user], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'User not found'], 404);
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
