<?php

namespace App\Policies;

use App\Models\User;
use App\Models\FieldSection;
use Illuminate\Auth\Access\HandlesAuthorization;

class FieldSectionPolicy
{
    use HandlesAuthorization;

    /**
     * Masters podem fazer qualquer coisa
     */
    public function before(User $user, string $ability): bool|null
    {
        return $user->isMaster() ? true : null;
    }

    public function viewAny(User $user): bool
    {
        return false;
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, FieldSection $section): bool
    {
        return false;
    }

    public function delete(User $user, FieldSection $section): bool
    {
        return false;
    }
}
