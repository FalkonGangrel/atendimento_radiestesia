<?php

namespace App\Services;

use App\Models\User;
use App\Models\Permission;
use App\Models\TipoAtendimento;
use Illuminate\Support\Collection;

class PermissionService
{
    protected array $cache = [];
    protected array $modoCache = [];
    protected array $globalCache = [];

    /* =====================================================
     |  PERMISSÃO
     ===================================================== */

    public function can(
        User $user,
        string $permissionKey,
        ?TipoAtendimento $tipo = null
    ): bool {
        if ($this->isSuperUser($user)) {
            return true;
        }

        // 🔹 Se não tem tipo → permissão global
        if (!$tipo) {
            return $this->canGlobal($user, $permissionKey);
        }

        return (bool) $this->resolve($user, $tipo)
            ->get($permissionKey, false);
    }

    protected function canGlobal(User $user, string $permissionKey): bool
    {
        return $this->globalCache[$user->id]
            ??= $user->tipoPermissions()
                ->whereNull('tipo_atendimento_id')
                ->with('permission:id,key')
                ->get()
                ->pluck('allowed', 'permission.key')
                ->get($permissionKey, false);
    }

    /* =====================================================
     |  PERMISSÕES POR TIPO
     ===================================================== */

    public function resolve(User $user, TipoAtendimento $tipo): Collection
    {
        if ($this->isSuperUser($user)) {
            return $this->allPermissionsGranted();
        }

        return $this->cache[$user->id][$tipo->id]
            ??= $this->permissionsFromDatabase($user, $tipo);
    }

    protected function permissionsFromDatabase(
        User $user,
        TipoAtendimento $tipo
    ): Collection {
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

    /* =====================================================
     |  MODO
     ===================================================== */

    public function modo(User $user, TipoAtendimento $tipo): ?string
    {
        if ($this->isSuperUser($user)) {
            return 'completo';
        }

        return $this->modoCache[$user->id][$tipo->id]
            ??= $user->tipoPermissions()
                ->where('tipo_atendimento_id', $tipo->id)
                ->where('allowed', true)
                ->value('modo');
    }

    /* =====================================================
     |  UTIL
     ===================================================== */

    public function isSuperUser(User $user): bool
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
}