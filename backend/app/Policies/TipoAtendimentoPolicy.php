<?php

namespace App\Policies;

use App\Models\User;
use App\Models\TipoAtendimento;

class TipoAtendimentoPolicy extends BasePermissionPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isMaster() || $user->isAdmin();
    }

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

    public function delete(User $user, TipoAtendimento $tipo)
    {
        return $user->isMaster() || $user->isAdmin();
    }

    public function use(User $user, TipoAtendimento $tipo): bool
    {
        if ($user->isMaster()) return true;

        return $tipo->permissions()
            ->where('user_id', $user->id)
            ->whereHas('permission', fn($q) => $q->where('slug', 'use'))
            ->where('allowed', true)
            ->exists();
    }

    public function create(User $user, TipoAtendimento $tipo): bool
    {
        return $this->can($user, $tipo, 'atendimentos.create');
    }

}
