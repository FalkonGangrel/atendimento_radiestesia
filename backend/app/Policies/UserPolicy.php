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
        // Pode ver a si mesmo
        if ($authUser->id === $targetUser->id) {
            return true;
        }

        // Ou se tiver permissão explícita
        return $authUser->hasPermission('usuarios.view');
    }

    /**
     * Atualizar usuário
     */
    public function update(User $authUser, User $targetUser): bool
    {
        // Pode editar a si mesmo (nome/email)
        if ($authUser->id === $targetUser->id) {
            return true;
        }

        return $authUser->hasPermission('usuarios.update');
    }

    /**
     * Alterar ROLE
     */
    public function updateRole(User $authUser, User $targetUser): bool
    {
        // BasePolicy já libera master
        // Aqui reforçamos regras de segurança

        // Nunca pode alterar a própria role
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
        // Nunca pode deletar a si mesmo
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
        // Nunca pode restaurar a si mesmo
        if ($authUser->id === $targetUser->id) {
            return false;
        }

        return $authUser->hasPermission('usuarios.restore');
    }
}
