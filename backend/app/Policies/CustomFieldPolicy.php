<?php

namespace App\Policies;

use App\Models\User;
use App\Models\CustomField;
use Illuminate\Auth\Access\HandlesAuthorization;

class CustomFieldPolicy
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
        return false; // só master passa pelo before
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, CustomField $customField): bool
    {
        return false;
    }

    public function delete(User $user, CustomField $customField): bool
    {
        return false;
    }
}
