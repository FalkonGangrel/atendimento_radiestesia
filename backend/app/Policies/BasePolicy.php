<?php

namespace App\Policies;

use App\Models\User;
use App\Models\TipoAtendimento;
use App\Services\PermissionService;
use Illuminate\Auth\Access\HandlesAuthorization;

abstract class BasePolicy
{
    use HandlesAuthorization;

    public function __construct(protected PermissionService $permissionService) {}

    /**
     * Superusuários (master/admin) têm acesso irrestrito.
     * O before() do Laravel chama isso antes de qualquer método da policy.
     */
    public function before(User $user, string $ability): bool|null
    {
        return in_array($user->role, ['master', 'admin'], true) ? true : null;
    }

    /**
     * Verifica permissão por tipo (caso padrão).
     */
    protected function can(User $user, string $key, TipoAtendimento $tipo): bool
    {
        return $this->permissionService->can($user, $key, $tipo);
    }

    /**
     * Verifica permissão global (sem tipo — ex: usuários).
     */
    protected function canGlobal(User $user, string $key): bool
    {
        return $this->permissionService->can($user, $key);
    }
}