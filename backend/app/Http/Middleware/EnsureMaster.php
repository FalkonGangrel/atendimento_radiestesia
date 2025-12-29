<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureMaster
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && $request->user()->role === 'master') {
            return $next($request);
        }

        return response()->json([
            'message' => 'Acesso negado. Apenas usuários master podem acessar este recurso.'
        ], 403);
    }
}
