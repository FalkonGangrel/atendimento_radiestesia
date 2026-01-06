<?php

namespace App\Policies;

use Illuminate\Auth\Access\HandlesAuthorization;
use App\Models\User;
use App\Models\TipoAtendimento;


class TipoAtendimentoPolicy
{
    use HandlesAuthorization;

    public function before(User $user, string $ability): bool|null
    {
        if ($user->role === 'master') {
            return true;
        }

        return null;
    }

    // TODOS autenticados podem listar
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, TipoAtendimento $tipoAtendimento): bool
    {
        return true;
    }

    // Apenas master (bloqueado aqui, liberado no before)
    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, TipoAtendimento $tipoAtendimento): bool
    {
        return false;
    }

    public function delete(User $user, TipoAtendimento $tipoAtendimento): bool
    {
        return false;
    }
}
