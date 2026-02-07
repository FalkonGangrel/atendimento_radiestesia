<?php

namespace App\Policies;

use App\Models\User;
use App\Models\TipoAtendimento;
use App\Services\PermissionService;

abstract class BasePermissionPolicy extends BasePolicy
{
    protected function can(
        User $user,
        TipoAtendimento $tipo,
        string $permissionKey
    ): bool {
        /** @var PermissionService $permissions */
        $permissions = app(PermissionService::class);

        return $permissions->can($user, $tipo, $permissionKey);
    }
}
