<?php

namespace App\Policies;

use App\Models\User;
use App\Models\FieldSection;

class FieldSectionPolicy extends BasePolicy
{
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
