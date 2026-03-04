<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Cliente;

/**
 * Clientes pertencem ao usuário (user_id), não a um TipoAtendimento.
 * Autorização baseada em ownership — o before() libera master/admin.
 */
class ClientePolicy extends BasePolicy
{
    public function viewAny(User $user): bool
    {
        return true; // todo usuário autenticado pode listar seus próprios clientes
    }

    public function view(User $user, Cliente $cliente): bool
    {
        return $user->isAdmin() || $user->id === $cliente->user_id;
    }

    public function create(User $user): bool
    {
        return true; // todo autenticado pode criar
    }

    public function update(User $user, Cliente $cliente): bool
    {
        return $user->id === $cliente->user_id;
    }

    public function delete(User $user, Cliente $cliente): bool
    {
        return $user->id === $cliente->user_id;
    }

    public function restore(User $user, Cliente $cliente): bool
    {
        return $user->id === $cliente->user_id;
    }

    public function forceDelete(User $user, Cliente $cliente): bool
    {
        return false; // apenas master/admin via before()
    }
}