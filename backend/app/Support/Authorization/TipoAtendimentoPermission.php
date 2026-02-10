<?php

namespace App\Support\Authorization;

use App\Models\User;
use App\Models\TipoAtendimento;
use App\Models\Permission;

class TipoAtendimentoPermission
{
    public static function allows(
        User $user,
        TipoAtendimento $tipo,
        string $permissionKey
    ): bool {
        // 👑 Admin/Master já passou pelo before,
        // mas isso deixa a classe segura para uso fora de Policy
        if ($user->is_admin || $user->is_master) {
            return true;
        }

        $permission = Permission::where('key', $permissionKey)->first();

        if (! $permission) {
            return false;
        }

        return $user->tipoPermissions()
            ->where('tipo_atendimento_id', $tipo->id)
            ->where('permission_id', $permission->id)
            ->where('allowed', true)
            ->exists();
    }
}
