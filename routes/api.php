<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PointageController;
use App\Http\Controllers\WorkDayController;
use App\Http\Controllers\PublicHolidayController;
use App\Http\Controllers\LeaveController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::post('register', [AuthController::class, 'register']);
// Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('login', [AuthController::class, 'login']);


Route::get('users', [AuthController::class, 'getUsers']);
Route::middleware('auth:sanctum')->post('logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->put('/users/{id}', [AuthController::class, 'updateUser']);

Route::middleware('guest')->post('forgot-password', [AuthController::class, 'forgotPassword']);

Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Pointage 
Route::middleware('auth:sanctum')->group(function () {
    Route::get('users/{id}', [AuthController::class, 'getUserById']); // Added semicolon here
    Route::delete('/users/{id}', [AuthController::class, 'deleteUser']);
    Route::post('/users/{userId}/pointages/arrivee', [PointageController::class, 'onArrival']);
    Route::post('/users/{userId}/pointages/depart', [PointageController::class, 'onDeparture']);
    Route::get('/users/{userId}/pointages/historique', [PointageController::class, 'showHistory']);
    Route::put('/users/{userId}/pointages/edit', [PointageController::class, 'editPointage']);
    Route::get('/users/{userId}/pointages/active-counters', [PointageController::class, 'getActiveCounter']);
    Route::get('/users/{userId}/worked-hours', [PointageController::class, 'getWorkedHours']);
    Route::get('/historique/{userId}/{date}', [PointageController::class, 'getHistoryByDate']);
    Route::get('/export-csv', [AuthController::class, 'exportUserWorkDays']);
    Route::get('/search-users', [AuthController::class, 'searchUsers']);

    Route::post('/leaves', [LeaveController::class, 'addLeave']); // Création d'un congé par un employé
    Route::post('/leaves/{id}/approve', [LeaveController::class, 'approve']); // Approuver un congé
    Route::post('/leaves/{id}/reject', [LeaveController::class, 'reject']); // Rejeter un congé
    Route::get('/leavesuser/{userId}', [LeaveController::class, 'leavesUser']);
        Route::delete('/leaves/{id}', [LeaveController::class, 'destroy']); // Supprimer un congé
    Route::put('/leaves/{id}', [LeaveController::class, 'update']); // Mettre à jour un congé
});
