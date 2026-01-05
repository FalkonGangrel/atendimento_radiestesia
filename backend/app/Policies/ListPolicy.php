<?php

namespace App\Policies;

use App\Models\User;
use App\Models\ListModel;
use Illuminate\Auth\Access\HandlesAuthorization;

class ListPolicy
{
    use HandlesAuthorization;

    public function before(User $user, string $ability): bool|null
    {
        return $user->isMaster() ? true : null;
    }

    public function viewAny(User $user): bool
    {
        return true; // index é público
    }

    public function create(User $user): bool { return false; }
    public function update(User $user, ListModel $list): bool { return false; }
    public function delete(User $user, ListModel $list): bool { return false; }
}
