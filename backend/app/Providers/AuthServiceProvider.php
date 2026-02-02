<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

// Models
use App\Models\Cliente;
use App\Models\CustomField;
use App\Models\FieldSection;
use App\Models\ListModel;
use App\Models\ListItem;
use App\Models\TipoAtendimento;
use App\Models\User;

// Policies
use App\Policies\ClientePolicy;
use App\Policies\CustomFieldPolicy;
use App\Policies\FieldSectionPolicy;
use App\Policies\ListPolicy;
use App\Policies\ListItemPolicy;
use App\Policies\TipoAtendimentoPolicy;
use App\Policies\UserPolicy;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Cliente::class => ClientePolicy::class,
        CustomField::class => CustomFieldPolicy::class,
        FieldSection::class => FieldSectionPolicy::class,
        ListModel::class => ListPolicy::class,
        ListItem::class => ListItemPolicy::class,
        TipoAtendimento::class => TipoAtendimentoPolicy::class,
        User::class => UserPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();

        /**
         * Gate permissão para master.
         */
        Gate::define('manage-permissions', function ($user) {
            return $user->role === 'master';
        });

        /**
         * Gate genérico de permissão (permissions.php)
         */
        Gate::define('permission', function (User $user, string $permission) {
            return $user->hasPermission($permission);
        });

        /**
         * Dashboard master (mantido por clareza semântica)
         */
        Gate::define('view-dashboard', function (User $user) {
            return $user->hasPermission('dashboard.master');
        });

        /**
         * Permissões de campos por usuário
         */
        Gate::define('manage-user-field-permissions', function (User $user, User $target) {
            if ($target->isMaster() && $user->id !== $target->id) {
                return false;
            }

            return $user->isMaster() || $user->id === $target->id;
        });
    }
}
