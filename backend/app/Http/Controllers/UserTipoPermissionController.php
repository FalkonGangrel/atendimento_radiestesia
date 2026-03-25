<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\TipoAtendimento;
use App\Models\UserTipoPermission;
use App\Services\PermissionService;
use Illuminate\Http\Request;

class UserTipoPermissionController extends Controller
{
    /**
     * GET /users/{user}/permissions/{tipo}
     * Retorna o estado atual das permissões do usuário para um tipo.
     */
    public function show(
        User $user,
        TipoAtendimento $tipo,
        PermissionService $permissionService
    ) {
        $this->authorize('viewAny', \App\Models\User::class);

        // Permissões granulares resolvidas
        $resolved = $permissionService->resolve($user, $tipo);

        // Modo atual (completo | simplificado)
        $modo = $permissionService->modo($user, $tipo);

        // Campos e listas disponíveis vinculados ao tipo
        $tipo->loadMissing(['customFields', 'lists.items']);

        return response()->json([
            'user_id'            => $user->id,
            'tipo_atendimento_id' => $tipo->id,
            'modo'               => $modo,
            'permissions'        => $resolved,
            'available_fields'   => $tipo->customFields,
            'available_lists'    => $tipo->lists,
        ]);
    }

    /**
     * POST /users/{user}/permissions/{tipo}
     * Salva modo (completo|simplificado) e permissões granulares.
     */
    public function store(
        Request $request,
        User $user,
        TipoAtendimento $tipo
    ) {
        $this->authorize('viewAny', \App\Models\User::class);

        $data = $request->validate([
            'modo'        => ['required', 'in:completo,simplificado'],
            'permissions' => ['required', 'array'],
            'permissions.*.key'     => ['required', 'string', 'exists:permissions,key'],
            'permissions.*.allowed' => ['required', 'boolean'],
        ]);

        foreach ($data['permissions'] as $item) {
            $permission = \App\Models\Permission::where('key', $item['key'])->firstOrFail();

            UserTipoPermission::updateOrCreate(
                [
                    'user_id'            => $user->id,
                    'tipo_atendimento_id' => $tipo->id,
                    'permission_id'      => $permission->id,
                ],
                [
                    'allowed' => $item['allowed'],
                    'modo'    => $data['modo'],
                ]
            );
        }

        return response()->json(['message' => 'Permissões salvas com sucesso.']);
    }
}