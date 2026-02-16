<?php

namespace App\Policies;

use App\Models\User;
use App\Models\TipoAtendimento;

class TipoAtendimentoPolicy extends BasePermissionPolicy
{
    public function view(User $user, TipoAtendimento $tipo): bool
    {
        return $user->tiposAtendimentoPermitidos()
            ->where('tipos_atendimento.id', $tipo->id)
            ->exists();
    }

    public function viewPermissions(User $user, TipoAtendimento $tipo): bool
    {
        return $user->isMaster() || $user->isAdmin();
    }

    public function attachToAtendimento(User $user, TipoAtendimento $tipo): bool
    {
        return $this->view($user, $tipo);
    }
}
