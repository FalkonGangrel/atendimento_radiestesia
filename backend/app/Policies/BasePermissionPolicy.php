<?php

namespace App\Policies;

use App\Models\User;
use App\Models\TipoAtendimento;
use App\Support\Authorization\TipoAtendimentoPermission;

abstract class BasePermissionPolicy extends BasePolicy
{
    protected function can(
        User $user,
        TipoAtendimento $tipo,
        string $permissionKey
    ): bool {
        return TipoAtendimentoPermission::allows(
            $user,
            $tipo,
            $permissionKey
        );
    }
}
