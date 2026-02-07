<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy extends BasePermissionPolicy
{
    public function viewAny(User $authUser): bool
    {
        return $authUser->hasPermission('usuarios.view');
    }

    public function view(User $authUser, User $targetUser): bool
    {
        return $authUser->hasPermission('usuarios.view');
    }

    public function update(User $authUser, User $targetUser): bool
    {
        if ($authUser->id === $targetUser->id) {
            return false;
        }

        return $authUser->hasPermission('usuarios.update');
    }

    public function updateRole(User $authUser, User $targetUser): bool
    {
        if ($authUser->id === $targetUser->id) {
            return false;
        }

        return $authUser->hasPermission('usuarios.update');
    }

    public function delete(User $authUser, User $targetUser): bool
    {
        if ($authUser->id === $targetUser->id) {
            return false;
        }

        return $authUser->hasPermission('usuarios.delete');
    }

    public function restore(User $authUser, User $targetUser): bool
    {
        return $authUser->hasPermission('usuarios.restore');
    }
}
