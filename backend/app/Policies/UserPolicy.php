<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    public function before(User $user, string $ability): bool|null
    {
        if ($user->isMaster()) {
            return true;
        }

        return null; // continua avaliando as regras abaixo
    }

    public function viewAny(User $user): bool
    {
        return false;
    }

    public function view(User $user, User $target): bool
    {
        return $user->id === $target->id;
    }

    public function update(User $user, User $target): bool
    {
        return $user->id === $target->id;
    }

    public function delete(User $user, User $target): bool
    {
        return $user->id !== $target->id;
    }
}
