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
use App\Models\TemplateAtendimento;
use App\Models\TipoAtendimento;
use App\Models\User;

// Policies
use App\Policies\AtendimentoPolicy;
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

        // Core domínio
        Cliente::class => ClientePolicy::class,
        TemplateAtendimento::class => AtendimentoPolicy::class,
        TipoAtendimento::class => TipoAtendimentoPolicy::class,

        // Estrutura dinâmica
        CustomField::class => CustomFieldPolicy::class,
        FieldSection::class => FieldSectionPolicy::class,
        ListModel::class => ListPolicy::class,
        ListItem::class => ListItemPolicy::class,

        // Usuários
        User::class => UserPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();

        /*
        |--------------------------------------------------------------------------
        | Dashboard comum (atendente)
        |--------------------------------------------------------------------------
        */
        Gate::define('view-own-dashboard', function (User $user) {
            return $user->hasPermission('dashboard.view');
        });

        /*
        |--------------------------------------------------------------------------
        | Dashboard administrativo
        |--------------------------------------------------------------------------
        */
        Gate::define('view-admin-dashboard', function (User $user) {
            return $user->hasPermission('dashboard.master');
        });

        /*
        |--------------------------------------------------------------------------
        | Gerenciar permissões
        |--------------------------------------------------------------------------
        */
        Gate::define('manage-permissions', function (User $user) {
            return $user->isMaster();
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
