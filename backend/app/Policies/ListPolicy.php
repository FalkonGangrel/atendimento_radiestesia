<?php

namespace App\Policies;

use App\Models\User;
use App\Models\ListModel;
use App\Models\Lists;
use App\Models\TipoAtendimento;
use Illuminate\Auth\Access\HandlesAuthorization;

class ListPolicy
{
    use HandlesAuthorization;

    public function before(User $user, string $ability): bool|null
    {
        if ($user->role === 'master') {
            return true;
        }

        return null;
    }

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, ListModel $list): bool
    {
        return true;
    }

    // Apenas master (bloqueado aqui, liberado no before)
    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, ListModel $list): bool
    {
        return false;
    }

    public function delete(User $user, ListModel $list): bool
    {
        return false;
    }

    public function viewInTipo(User $user, ListModel $list, TipoAtendimento $tipo): bool
    {
        // Primeiro verifica se tem permissão para o tipo
        if (!$user->hasPermissionForTipo($tipo->id)) {
            return false;
        }

        // Depois verifica se a lista está vinculada ao tipo
        return $tipo->lists()->where('list_id', $list->id)->exists();
    }
}
