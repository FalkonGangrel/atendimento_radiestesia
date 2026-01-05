<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\CustomField;
use App\Models\FieldSection;
use App\Models\ListModel;
use App\Models\ListItem;
use App\Models\User;
use App\Policies\CustomFieldPolicy;
use App\Policies\FieldSectionPolicy;
use App\Policies\ListPolicy;
use App\Policies\ListItemPolicy;
use App\Policies\UserPolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    protected $policies = [
        CustomField::class => CustomFieldPolicy::class,
        FieldSection::class => FieldSectionPolicy::class,
        ListModel::class => ListPolicy::class,
        ListItem::class => ListItemPolicy::class,
        User::class => UserPolicy::class,
    ];

    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Gate::define('view-dashboard', function ($user) {
            return $user->isMaster();
        });

        Gate::define('manage-user-field-permissions', function (User $user, User $target) {
            if ($target->isMaster() && $user->id !== $target->id) {
                return false;
            }

            return $user->isMaster() || $user->id === $target->id;
        });
    }
}
