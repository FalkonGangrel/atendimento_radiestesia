<?php

namespace App\Http\Controllers;

use App\Models\TipoAtendimento;
use App\Services\PermissionService;
use Illuminate\Http\Request;

class TipoAtendimentoPermissionController extends Controller
{
    public function __construct(
        protected PermissionService $permissionService
    ) {}

    public function show(Request $request, TipoAtendimento $tipo)
    {
        $user = $request->user();

        // Segurança: precisa ao menos visualizar o tipo
        $this->authorize('viewAny', $tipo);

        $permissions = $this->permissionService
            ->resolve($user, $tipo);

        return response()->json([
            'tipo_id' => $tipo->id,
            'permissions' => $permissions,
        ]);
    }
}
