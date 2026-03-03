<?php

namespace App\Policies;

use App\Models\User;
use App\Models\FieldSection;
use App\Models\TipoAtendimento;

class FieldSectionPolicy extends BasePolicy
{
    public function viewAny(User $user, TipoAtendimento $tipo): bool
    {
        return $this->can($user, 'field_sections.view', $tipo);
    }

    public function view(User $user, FieldSection $section): bool
    {
        return $this->can($user, 'field_sections.view', $section->tipoAtendimento);
    }

    public function create(User $user, TipoAtendimento $tipo): bool
    {
        return $this->can($user, 'field_sections.create', $tipo);
    }

    public function update(User $user, FieldSection $section): bool
    {
        return $this->can($user, 'field_sections.update', $section->tipoAtendimento);
    }

    public function delete(User $user, FieldSection $section): bool
    {
        return $this->can($user, 'field_sections.delete', $section->tipoAtendimento);
    }
}