<?php
 
namespace App\Http\Controllers;
 
use App\Models\Tache;
use Illuminate\Http\Request;
 
class TacheController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->input('user_id');
        $query = Tache::query();
 
        if ($userId) {
            $query->where('user_id', $userId);
        }
 
        return response()->json($query->orderBy('ordre')->get());
    }
 
    public function store(Request $request)
    {
        $validated = $request->validate([
            'titre' => 'required|string',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'statut' => 'in:todo,in_progress,done',
            'user_id' => 'required|exists:users,id',
            'ordre' => 'nullable|integer',
            'commentaire' => 'nullable|string', // ajout ici
        ]);

        $tache = Tache::create($validated);

        return response()->json($tache, 201);
    }

 
    public function show(Tache $tache)
    {
        return response()->json($tache);
    }
 
 public function updateCommentaire(Request $request, $id)
{
    $request->validate([
        'commentaire' => 'nullable|string'
    ]);

    $tache = Tache::findOrFail($id);
    $tache->commentaire = $request->input('commentaire');
    $tache->save();

    return response()->json(['message' => 'Commentaire mis à jour', 'tache' => $tache]);
}

public function update(Request $request, $id)
{
    try {
        $tache = Tache::findOrFail($id);

        $validated = $request->validate([
            'titre' => 'sometimes|required|string',
            'description' => 'nullable|string',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date|after_or_equal:start_date',
            'statut' => 'sometimes|required|in:todo,in_progress,done',
            'user_id' => 'sometimes|required|exists:users,id',
            'ordre' => 'sometimes|nullable|integer',
            'commentaire' => 'sometimes|nullable|string',
        ]);

        $tache->fill($validated);
        $tache->save();

        \Log::info('Tâche mise à jour avec succès :', $tache->toArray());

        return response()->json($tache);

    } catch (\Throwable $e) {
        \Log::error('Erreur lors de la mise à jour de la tâche : ' . $e->getMessage());
        return response()->json(['message' => 'Erreur serveur', 'error' => $e->getMessage()], 500);
    }
}

 
 
public function destroy($id)
{
    try {
        $tache = Tache::findOrFail($id);
 
        \Log::info("Suppression tâche ID: {$tache->id}");
 
        $tache->delete();
 
        return response()->json(['message' => 'Tâche supprimée']);
    } catch (\Throwable $e) {
        \Log::error("Erreur lors de la suppression de la tâche ID $id : " . $e->getMessage());
        return response()->json(['message' => 'Erreur lors de la suppression', 'error' => $e->getMessage()], 500);
    }
}
public function updateInfo(Request $request, $id)
{
    try {
        $tache = Tache::findOrFail($id);
 
        $validated = $request->validate([
            'titre' => 'sometimes|required|string',
            'description' => 'sometimes|nullable|string',
        ]);
 
        $tache->fill($validated);
        $tache->save();
 
        \Log::info("Tâche ID {$id} mise à jour (titre/description) : ", $validated);
 
        return response()->json([
            'message' => 'Tâche mise à jour avec succès',
            'tache' => $tache
        ]);
 
    } catch (\Throwable $e) {
        \Log::error("Erreur updateInfo tâche ID $id : " . $e->getMessage());
 
        return response()->json([
            'message' => 'Erreur lors de la mise à jour',
            'error' => $e->getMessage()
        ], 500);
    }
}
 
}