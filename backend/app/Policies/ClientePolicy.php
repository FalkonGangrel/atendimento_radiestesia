<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Cliente;
use App\Models\TipoAtendimento;

class ClientePolicy extends BasePolicy
{
    public function viewAny(User $user, TipoAtendimento $tipo): bool
    {
        return $this->can($user, 'clientes.view', $tipo);
    }

    public function view(User $user, Cliente $cliente): bool
    {
        return $this->can($user, 'clientes.view', $cliente->tipoAtendimento);
    }

    public function create(User $user, TipoAtendimento $tipo): bool
    {
        return $this->can($user, 'clientes.create', $tipo);
    }

    public function update(User $user, Cliente $cliente): bool
    {
        return $this->can($user, 'clientes.update', $cliente->tipoAtendimento);
    }

    public function delete(User $user, Cliente $cliente): bool
    {
        return $this->can($user, 'clientes.delete', $cliente->tipoAtendimento);
    }

    public function restore(User $user, Cliente $cliente): bool
    {
        return $this->can($user, 'clientes.restore', $cliente->tipoAtendimento);
    }
}