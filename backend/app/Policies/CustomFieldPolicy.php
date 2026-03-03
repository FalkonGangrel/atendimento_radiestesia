<?php

namespace App\Policies;

use App\Models\User;
use App\Models\CustomField;
use App\Models\TipoAtendimento;

class CustomFieldPolicy extends BasePolicy
{
    public function viewAny(User $user, TipoAtendimento $tipo): bool
    {
        return $this->can($user, 'custom_fields.view', $tipo);
    }

    public function view(User $user, CustomField $field): bool
    {
        return $this->can($user, 'custom_fields.view', $field->tipoAtendimento);
    }

    public function create(User $user, TipoAtendimento $tipo): bool
    {
        return $this->can($user, 'custom_fields.create', $tipo);
    }

    public function update(User $user, CustomField $field): bool
    {
        return $this->can($user, 'custom_fields.update', $field->tipoAtendimento);
    }

    public function delete(User $user, CustomField $field): bool
    {
        return $this->can($user, 'custom_fields.delete', $field->tipoAtendimento);
    }
}