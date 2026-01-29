<?php

namespace App\Policies;

use App\Models\ListItem;
use App\Models\User;

class ListItemPolicy extends BasePolicy
{
    public function create(User $user): bool
    {
        return $user->hasPermission('listas.manage');
    }

    public function update(User $user, ListItem $item): bool
    {
        return $user->hasPermission('listas.manage');
    }

    public function delete(User $user, ListItem $item): bool
    {
        return $user->hasPermission('listas.manage');
    }
}
