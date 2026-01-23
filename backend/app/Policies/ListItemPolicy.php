<?php

namespace App\Policies;

use App\Models\User;
use App\Models\ListItem;


class ListItemPolicy extends BasePolicy
{
    public function create(User $user): bool { return false; }
    public function update(User $user, ListItem $item): bool { return false; }
    public function delete(User $user, ListItem $item): bool { return false; }
}
