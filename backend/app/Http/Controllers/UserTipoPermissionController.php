<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Permission;
use App\Models\TipoAtendimento;
use App\Models\UserTipoPermission;
use App\Services\PermissionService;
use Illuminate\Http\Request;

class UserTipoPermissionController extends Controller
{
    /**
     * GET /users/{user}/permissions/{tipo}
     * Lista permissões efetivas
     */
    public function show(
        User $user,
        TipoAtendimento $tipo,
        PermissionService $permissionService
    ) {
        return response()->json([
            'user_id' => $user->id,
            'tipo_atendimento_id' => $tipo->id,
            'permissions' => $permissionService->resolve($user, $tipo),
        ]);
    }

    /**
     * POST /users/{user}/permissions/{tipo}
     * Atualiza permissões explicitamente
     */
    public function store(
        Request $request,
        User $user,
        TipoAtendimento $tipo
    ) {
        $this->authorize('manage-permissions');

        $data = $request->validate([
            'permissions' => ['required', 'array'],
            'permissions.*.key' => ['required', 'string', 'exists:permissions,key'],
            'permissions.*.allowed' => ['required', 'boolean'],
        ]);

        foreach ($data['permissions'] as $item) {
            $permission = Permission::where('key', $item['key'])->first();

            UserTipoPermission::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'tipo_atendimento_id' => $tipo->id,
                    'permission_id' => $permission->id,
                ],
                [
                    'allowed' => $item['allowed'],
                ]
            );
        }

        return response()->json([
            'message' => 'Permissões atualizadas com sucesso',
        ]);
    }
}
