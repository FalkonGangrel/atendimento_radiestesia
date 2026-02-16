<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Cliente;

class ClientePolicy extends BasePermissionPolicy
{
    public function viewAny(User $user): bool
    {
        // Se master, pode ver todos
        if ($user->isMaster()) {
            return true;
        }

        return $user->hasPermission('clientes.view');
    }

    public function view(User $user, Cliente $cliente): bool
    {
        if ($user->isMaster()) {
            return true;
        }

        return $user->hasPermission('clientes.view')
            && $cliente->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('clientes.create');
    }

    public function update(User $user, Cliente $cliente): bool
    {
        if ($user->isMaster()) {
            return true;
        }

        return $user->hasPermission('clientes.update')
            && $cliente->user_id === $user->id;
    }

    public function delete(User $user, Cliente $cliente): bool
    {
        if ($user->isMaster()) {
            return true;
        }

        return $user->hasPermission('clientes.delete')
            && $cliente->user_id === $user->id;
    }

    public function restore(User $user, Cliente $cliente): bool
    {
        return $user->isMaster();
    }
}
