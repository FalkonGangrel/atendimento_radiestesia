<?php

namespace App\Policies;

use App\Models\User;
use App\Models\CustomField;
use App\Models\TipoAtendimento;

class CustomFieldPolicy extends BasePolicy
{
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

    public function viewInTipo(User $user, CustomField $field, TipoAtendimento $tipo): bool
    {
        // Primeiro verifica se tem permissão para o tipo
        if (!$user->hasPermissionForTipo($tipo->id)) {
            return false;
        }

        // Depois verifica se o campo está vinculado ao tipo
        return $tipo->customFields()->where('custom_field_id', $field->id)->exists();
    }
}
