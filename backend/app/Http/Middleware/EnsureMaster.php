<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureMaster
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user() || !$request->user()->isMaster()) {
            return response()->json([
                'message' => 'Acesso negado. Apenas usuários Master podem acessar este recurso.',
            ], 403);
        }

        return $next($request);
    }
}
