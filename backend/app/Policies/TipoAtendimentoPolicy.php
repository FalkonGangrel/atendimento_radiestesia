<?php

namespace App\Policies;

use App\Models\User;
use App\Models\TipoAtendimento;

class TipoAtendimentoPolicy extends BasePolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, TipoAtendimento $tipo): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->isMaster() || $user->isAdmin();
    }

    public function update(User $user, TipoAtendimento $tipo): bool
    {
        return $user->isMaster() || $user->isAdmin();
    }

    public function delete(User $user, TipoAtendimento $tipo): bool
    {
        return $user->isMaster();
    }
}
