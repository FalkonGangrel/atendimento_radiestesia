<?php

namespace App\Policies;

use App\Models\User;
use App\Models\TipoAtendimento;

class DashboardPolicy extends BasePolicy
{
    public function view(User $user, TipoAtendimento $tipo): bool
    {
        return $this->can($user, 'dashboard.view', $tipo);
    }
}