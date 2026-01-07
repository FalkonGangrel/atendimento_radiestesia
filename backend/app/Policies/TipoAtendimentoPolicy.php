<?php

namespace App\Policies;

use App\Models\User;
use App\Models\TipoAtendimento;

class TipoAtendimentoPolicy
{
    /**
     * Master pode tudo
     */
    public function before(User $user, string $ability): ?bool
    {
        if ($user->isMaster()) {
            return true;
        }

        return null;
    }

    /**
     * Verificar se o usuário pode visualizar este tipo
     */
    public function view(User $user, TipoAtendimento $tipo): bool
    {
        return $user->hasPermissionForTipo($tipo->id);
    }

    /**
     * Verificar se o usuário pode criar atendimento deste tipo
     */
    public function create(User $user, TipoAtendimento $tipo): bool
    {
        return $user->hasPermissionForTipo($tipo->id);
    }
}
