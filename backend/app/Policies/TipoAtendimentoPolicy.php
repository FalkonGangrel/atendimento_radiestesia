<?php

namespace App\Policies;

use App\Models\User;
use App\Models\TipoAtendimento;

class TipoAtendimentoPolicy extends BasePermissionPolicy
{
    public function viewAny(User $user, TipoAtendimento $tipo): bool
    {
        return $this->can($user, $tipo, 'tipos.view');
    }

    public function view(User $user, TipoAtendimento $tipo): bool
    {
        return $this->can(
            $user,
            $tipo,
            'tipos.view'
        );
    }

    public function create(User $user, TipoAtendimento $tipo): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $this->can($user, $tipo, 'tipos.manage');
    }

    public function update(User $user, TipoAtendimento $tipo): bool
    {
        return $this->can(
            $user,
            $tipo,
            'tipos.manage'
        ) ;
    }

    public function delete(User $user, TipoAtendimento $tipo): bool
    {
        return $this->can(
            $user,
            $tipo,
            'tipos.manage'
        );
    }
}
