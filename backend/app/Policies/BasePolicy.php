<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

abstract class BasePolicy
{
    use HandlesAuthorization;

    /**
     * Executado antes de qualquer método da policy.
     */
    public function before(User $user, string $ability): bool|null
    {
        // Master pode tudo
        if ($user->role === 'master') {
            return true;
        }

        return null;
    }

    protected function isAdmin(User $user): bool
    {
        return in_array($user->role, ['master', 'admin'], true);
    }

    protected function isOwner(User $user, $model): bool
    {
        return isset($model->user_id) && $model->user_id === $user->id;
    }
}
