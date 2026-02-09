<?php

namespace App\Policies;

use App\Models\User;
use App\Models\TemplateAtendimento;
use App\Models\TipoAtendimento;

class AtendimentoPolicy extends BasePermissionPolicy
{
    public function viewAny(User $user, TipoAtendimento $tipo): bool
    {
        return $this->can($user, $tipo, 'atendimentos.view');
    }

    public function view(User $user, TemplateAtendimento $atendimento): bool
    {
        return $this->can(
            $user,
            $atendimento->tipoAtendimento,
            'atendimentos.view'
        ) && $this->isOwner($user, $atendimento);
    }

    public function create(User $user, TipoAtendimento $tipo): bool
    {
        return $this->can($user, $tipo, 'atendimentos.create');
    }

    public function update(User $user, TemplateAtendimento $atendimento): bool
    {
        return $this->can(
            $user,
            $atendimento->tipoAtendimento,
            'atendimentos.update'
        ) && $this->isOwner($user, $atendimento);
    }

    public function delete(User $user, TemplateAtendimento $atendimento): bool
    {
        return $this->can(
            $user,
            $atendimento->tipoAtendimento,
            'atendimentos.delete'
        ) && $this->isOwner($user, $atendimento);
    }
}
