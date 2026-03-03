<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy extends BasePolicy
{
    public function viewAny(User $user): bool
    {
        return $this->canGlobal($user, 'usuarios.view');
    }

    public function view(User $user, User $target): bool
    {
        return $this->canGlobal($user, 'usuarios.view');
    }

    public function update(User $user, User $target): bool
    {
        // Ninguém edita a si mesmo por aqui (use rota própria de perfil)
        if ($user->id === $target->id) {
            return false;
        }

        return $this->canGlobal($user, 'usuarios.update');
    }

    public function updateRole(User $user, User $target): bool
    {
        if ($user->id === $target->id) {
            return false;
        }

        return $this->canGlobal($user, 'usuarios.update');
    }

    public function delete(User $user, User $target): bool
    {
        if ($user->id === $target->id) {
            return false;
        }

        return $this->canGlobal($user, 'usuarios.delete');
    }

    public function restore(User $user, User $target): bool
    {
        return $this->canGlobal($user, 'usuarios.restore');
    }
}