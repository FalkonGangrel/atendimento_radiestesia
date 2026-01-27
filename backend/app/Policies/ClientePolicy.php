<?php

namespace App\Policies;

use App\Models\Cliente;
use App\Models\User;

class ClientePolicy extends BasePolicy
{
    /**
     * Listagem
     * Todos usuários autenticados podem listar,
     * o filtro será aplicado no controller.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Visualizar cliente
     */
    public function view(User $user, Cliente $cliente): bool
    {
        return $user->isMaster() || $cliente->user_id === $user->id;
    }

    /**
     * Criar cliente
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Atualizar cliente
     */
    public function update(User $user, Cliente $cliente): bool
    {
        return $user->isMaster() || $cliente->user_id === $user->id;
    }

    /**
     * Desativar cliente
     */
    public function delete(User $user, Cliente $cliente): bool
    {
        return $user->isMaster() || $cliente->user_id === $user->id;
    }
}
