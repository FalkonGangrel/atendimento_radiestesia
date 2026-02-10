<?php

namespace App\Policies;

use App\Models\User;
use App\Models\CustomField;
use App\Models\TipoAtendimento;

class CustomFieldPolicy extends BasePermissionPolicy
{
    public function viewAny(User $user, TipoAtendimento $tipo): bool
    {
        return $this->can($user, $tipo, 'custom_fields.view');
    }

    public function create(User $user, TipoAtendimento $tipo): bool
    {
        return $this->can($user, $tipo, 'custom_fields.create');
    }

    public function update(User $user, CustomField $field, TipoAtendimento $tipo): bool
    {
        return $this->can($user, $tipo, 'custom_fields.update');
    }

    public function delete(User $user, CustomField $field, TipoAtendimento $tipo): bool
    {
        return $this->can($user, $tipo, 'custom_fields.delete');
    }
}
