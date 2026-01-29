<?php

namespace App\Policies;

use App\Models\Cliente;
use App\Models\User;

class ClientePolicy extends BasePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('clientes.view');
    }

    public function view(User $user, Cliente $cliente): bool
    {
        if ($user->hasPermission('clientes.view')) {
            return true;
        }

        return $user->hasPermission('clientes.view_owner')
            && $this->isOwner($user, $cliente);
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('clientes.create');
    }

    public function update(User $user, Cliente $cliente): bool
    {
        if (! $user->hasPermission('clientes.update')) {
            return false;
        }

        return $this->isOwner($user, $cliente) || $this->isAdmin($user);
    }

    public function delete(User $user, Cliente $cliente): bool
    {
        if (! $user->hasPermission('clientes.delete')) {
            return false;
        }

        return $this->isOwner($user, $cliente) || $this->isAdmin($user);
    }

    public function restore(User $authUser, Cliente $cliente): bool
    {
        return $authUser->hasPermission('clientes.restore');
    }
}
