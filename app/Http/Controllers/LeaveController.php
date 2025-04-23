<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Leave;

class LeaveController extends Controller
{
    /*store*/
    public function store(Request $request)
    {
        $request->validate([
            'pointage_id' => 'required|exists:pointages,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'reason' => 'required|string'
        ]);

        $leave = Leave::create([
            'pointage_id' => $request->pointage_id,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'reason' => $request->reason,
        ]);

        return response()->json($leave, 201);
    }
    public function leavesUser($userId)
        {
            try {
                // Charger les congés avec les relations nécessaires
                $leaves = Leave::with(['pointage.user'])
                    ->whereHas('pointage', function($query) use ($userId) {
                        $query->where('user_id', $userId);
                    })
                    ->get();

                return response()->json($leaves);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        }

        public function destroy($id)
        {
            try {
                $leave = Leave::findOrFail($id);
                $leave->delete();
        
                return response()->json(['message' => 'Leave deleted successfully'], 200);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        }
        public function approve($id)
        {
            try {
                $leave = Leave::findOrFail($id);
                $leave->status = 'approved';
                $leave->save();
        
                return response()->json(['message' => 'Leave approved successfully'], 200);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        }
        public function update(Request $request, $id)
        {
            $request->validate([
                'pointage_id' => 'required|exists:pointages,id',
                'start_date' => 'required|date',
                'end_date' => 'required|date',
                'reason' => 'required|string'
            ]);
        
            try {
                $leave = Leave::findOrFail($id);
                $leave->update([
                    'pointage_id' => $request->pointage_id,
                    'start_date' => $request->start_date,
                    'end_date' => $request->end_date,
                    'reason' => $request->reason,
                ]);
        
                return response()->json($leave, 200);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        }
                            

}
