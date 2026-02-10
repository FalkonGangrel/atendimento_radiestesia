<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Cliente;
use App\Models\TipoAtendimento;

class ClientePolicy extends BasePermissionPolicy
{
    public function view(User $user, Cliente $cliente): bool
    {
        return $this->can(
            $user,
            $cliente->tipoAtendimento,
            'clientes.view'
        ) && $this->isOwner($user, $cliente);
    }

    public function create(User $user, TipoAtendimento $tipo): bool
    {
        return $this->can($user, $tipo, 'clientes.create');
    }

    public function update(User $user, Cliente $cliente): bool
    {
        return $this->can(
            $user,
            $cliente->tipoAtendimento,
            'clientes.update'
        ) && $this->isOwner($user, $cliente);
    }

    public function delete(User $user, Cliente $cliente): bool
    {
        return $this->can(
            $user,
            $cliente->tipoAtendimento,
            'clientes.delete'
        ) && $this->isOwner($user, $cliente);
    }
}
