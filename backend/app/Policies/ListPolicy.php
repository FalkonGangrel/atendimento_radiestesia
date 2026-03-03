<?php

namespace App\Policies;

use App\Models\User;
use App\Models\ListModel;
use App\Models\TipoAtendimento;

class ListPolicy extends BasePolicy
{
    public function viewAny(User $user, TipoAtendimento $tipo): bool
    {
        return $this->can($user, 'listas.view', $tipo);
    }

    public function view(User $user, ListModel $list): bool
    {
        return $this->can($user, 'listas.view', $list->tipoAtendimento);
    }

    public function create(User $user, TipoAtendimento $tipo): bool
    {
        return $this->can($user, 'listas.create', $tipo);
    }

    public function update(User $user, ListModel $list): bool
    {
        return $this->can($user, 'listas.update', $list->tipoAtendimento);
    }

    public function delete(User $user, ListModel $list): bool
    {
        return $this->can($user, 'listas.delete', $list->tipoAtendimento);
    }
}