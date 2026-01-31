<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class PermissionMiddleware
{
    public function handle(Request $request, Closure $next, string $permission)
    {
        $user = $request->user();

        if (!$user) {
            abort(401);
        }

        // 🔥 MASTER PASSA SEM VERIFICAÇÃO
        if ($user->role === 'master') {
            return $next($request);
        }

        $permissions = config("permissions.{$user->role}", []);

        if (!in_array($permission, $permissions)) {
            abort(403, 'Permissão negada');
        }

        return $next($request);
    }
}
