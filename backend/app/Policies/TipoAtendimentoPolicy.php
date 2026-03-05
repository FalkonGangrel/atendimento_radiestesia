<?php

namespace App\Policies;

use App\Models\User;
use App\Models\TipoAtendimento;

class TipoAtendimentoPolicy extends BasePolicy
{
    /**
     * Listagem geral: só superusuários veem todos os tipos.
     * Usuários comuns acessam apenas os tipos aos quais têm permissão (via view).
     */
    public function viewAny(User $user): bool
    {
        // before() já libera master/admin; para outros, sempre false aqui.
        return false;
    }

    /**
     * Ver um tipo específico: basta ter qualquer permissão nele.
     */
    public function view(User $user, TipoAtendimento $tipo): bool
    {
        return $this->permissionService->resolve($user, $tipo)->containsStrict(true);
    }

    /**
     * Usar um tipo para registrar atendimento:
     * verifica se o usuário tem pelo menos uma permissão ativa no tipo.
     */
    public function use(User $user, TipoAtendimento $tipo): bool
    {
        return $this->permissionService->resolve($user, $tipo)->containsStrict(true);
    }

    /**
     * Gerenciamento de permissões de um tipo: só superusuários.
     */
    public function viewPermissions(User $user, TipoAtendimento $tipo): bool
    {
        return false; // before() libera master/admin
    }

    public function create(User $user): bool
    {
        return false; // antes: só superusuários
    }

    public function update(User $user, TipoAtendimento $tipo): bool
    {
        return false; // antes: só superusuários
    }

    public function delete(User $user, TipoAtendimento $tipo): bool
    {
        return false; // antes: só superusuários
    }
}