<?php

namespace App\Services;

use App\Models\User;
use App\Models\Permission;
use App\Models\TipoAtendimento;
use Illuminate\Support\Collection;

class PermissionService
{
    protected array $cache = [];

    /**
     * Resolve todas as permissões do usuário para um Tipo de Atendimento.
     */
    public function resolve(User $user, TipoAtendimento $tipo): Collection
    {
        if ($this->isSuperUser($user)) {
            return $this->allPermissionsGranted();
        }

        return $this->cache[$user->id][$tipo->id]
            ??= $this->permissionsFromDatabase($user, $tipo);
    }

    /**
     * Verifica se o usuário pode executar uma ação específica.
     */
    public function can(
        User $user,
        TipoAtendimento $tipo,
        string $permissionKey
    ): bool {
        if ($this->isSuperUser($user)) {
            return true;
        }

        return (bool) $this->resolve($user, $tipo)
            ->get($permissionKey, false);
    }

    /* -------------------------------------------------
     |  Internals
     | -------------------------------------------------
     */

    protected function isSuperUser(User $user): bool
    {
        return in_array($user->role, ['master', 'admin'], true);
    }

    protected function allPermissionsGranted(): Collection
    {
        static $all;

        return $all ??= Permission::query()
            ->pluck('key')
            ->mapWithKeys(fn ($key) => [$key => true]);
    }

    protected function permissionsFromDatabase(
        User $user,
        TipoAtendimento $tipo
    ): Collection {
        // Default: todas as permissões = false
        $permissions = Permission::query()
            ->pluck('key')
            ->mapWithKeys(fn ($key) => [$key => false]);

        $userPermissions = $user->tipoPermissions()
            ->where('tipo_atendimento_id', $tipo->id)
            ->with('permission:id,key')
            ->get();

        foreach ($userPermissions as $userPermission) {
            $permissions[$userPermission->permission->key]
                = (bool) $userPermission->allowed;
        }

        return $permissions;
    }
}
