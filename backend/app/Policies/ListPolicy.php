<?php

namespace App\Policies;

use App\Models\ListModel;
use App\Models\User;

class ListPolicy extends BasePolicy
{
    public function viewAny(User $user): bool
    {
        return true; // todos autenticados veem listas
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('listas.manage');
    }

    public function update(User $user, ListModel $list): bool
    {
        return $user->hasPermission('listas.manage');
    }

    public function delete(User $user, ListModel $list): bool
    {
        return $user->hasPermission('listas.manage');
    }
}
