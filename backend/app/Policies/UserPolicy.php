<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy extends BasePolicy
{
    /**
     * Listar usuários
     */
    public function viewAny(User $authUser): bool
    {
        return $authUser->hasPermission('usuarios.view');
    }

    /**
     * Ver usuário específico
     */
    public function view(User $authUser, User $targetUser): bool
    {
        return $authUser->hasPermission('usuarios.view');
    }

    /**
     * Atualizar usuário (dados básicos)
     */
    public function update(User $authUser, User $targetUser): bool
    {
        if ($authUser->id === $targetUser->id) {
            return false;
        }

        return $authUser->hasPermission('usuarios.update');
    }

    /**
     * Alterar role
     */
    public function updateRole(User $authUser, User $targetUser): bool
    {
        if ($authUser->id === $targetUser->id) {
            return false;
        }

        return $authUser->hasPermission('usuarios.update');
    }

    /**
     * Deletar usuário (soft delete)
     */
    public function delete(User $authUser, User $targetUser): bool
    {
        if ($authUser->id === $targetUser->id) {
            return false;
        }

        return $authUser->hasPermission('usuarios.delete');
    }

    /**
     * Restaurar usuário
     */
    public function restore(User $authUser, User $targetUser): bool
    {
        return $authUser->hasPermission('usuarios.restore');
    }
}
