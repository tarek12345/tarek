<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;
use Carbon\Carbon;

class CheckTokenExpiration
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken(); // Récupérer le token envoyé

        if ($token) {
            $accessToken = PersonalAccessToken::findToken($token);

            if ($accessToken && $accessToken->created_at->addMinutes(config('sanctum.expiration'))->isPast()) {
                return response()->json(['message' => 'Session expirée, veuillez vous reconnecter.'], 401);
            }
        }

        return $next($request);
    }
}
