<?php

namespace App\Policies;

use App\Models\User;
use App\Models\ListItem;
use App\Models\TipoAtendimento;

class ListItemPolicy extends BasePolicy
{
    public function viewAny(User $user, TipoAtendimento $tipo): bool
    {
        return $this->can($user, 'listas.view', $tipo);
    }

    public function view(User $user, ListItem $item): bool
    {
        return $this->can($user, 'listas.view', $item->list->tipoAtendimento);
    }

    public function create(User $user, TipoAtendimento $tipo): bool
    {
        return $this->can($user, 'listas.create', $tipo);
    }

    public function update(User $user, ListItem $item): bool
    {
        return $this->can($user, 'listas.update', $item->list->tipoAtendimento);
    }

    public function delete(User $user, ListItem $item): bool
    {
        return $this->can($user, 'listas.delete', $item->list->tipoAtendimento);
    }
}