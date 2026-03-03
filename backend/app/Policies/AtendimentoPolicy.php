<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Atendimento;
use App\Models\TipoAtendimento;

class AtendimentoPolicy extends BasePolicy
{
    public function viewAny(User $user, TipoAtendimento $tipo): bool
    {
        return $this->can($user, 'atendimentos.view', $tipo);
    }

    public function view(User $user, Atendimento $atendimento): bool
    {
        return $this->can($user, 'atendimentos.view', $atendimento->tipoAtendimento);
    }

    public function create(User $user, TipoAtendimento $tipo): bool
    {
        return $this->can($user, 'atendimentos.create', $tipo);
    }

    public function update(User $user, Atendimento $atendimento): bool
    {
        return $this->can($user, 'atendimentos.update', $atendimento->tipoAtendimento);
    }

    public function delete(User $user, Atendimento $atendimento): bool
    {
        return $this->can($user, 'atendimentos.delete', $atendimento->tipoAtendimento);
    }
}