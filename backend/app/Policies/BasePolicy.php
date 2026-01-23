<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

abstract class BasePolicy
{
    use HandlesAuthorization;

    /**
     * Regras globais antes de qualquer policy.
     */
    public function before(User $user, string $ability, $model = null): bool|null
    {
        // Master pode tudo
        if ($user->role === 'master') {
            return true;
        }

        return null;
    }

    protected function isAdmin(User $user): bool
    {
        return in_array($user->role, ['master', 'admin']);
    }

    protected function isOwner(User $user, $model): bool
    {
        return isset($model->created_by) && $model->created_by === $user->id;
    }
}
