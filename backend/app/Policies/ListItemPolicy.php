<?php

namespace App\Policies;

use App\Models\User;
use App\Models\ListItem;
use Illuminate\Auth\Access\HandlesAuthorization;


class ListItemPolicy
{
    use HandlesAuthorization;

    public function before(User $user, string $ability): bool|null
    {
        return $user->isMaster() ? true : null;
    }

    public function create(User $user): bool { return false; }
    public function update(User $user, ListItem $item): bool { return false; }
    public function delete(User $user, ListItem $item): bool { return false; }
}
