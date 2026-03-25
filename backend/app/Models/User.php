<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Services\PermissionService;
use App\Models\TipoAtendimento;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'deleted_at' => 'datetime',
    ];

    /* -----------------------------------------------------------------
    |   RELACIONAMENTOS
    |  -----------------------------------------------------------------
     */

    public function tipoAtendimentoPermissions()
    {
        return $this->hasMany(UserTipoAtendimentoPermission::class);
    }


    public function tipoPermissions(): HasMany
    {
        return $this->hasMany(UserTipoPermission::class);
    }

    public function clientes(): HasMany
    {
        return $this->hasMany(Cliente::class, 'user_id');
    }

    public function atendimentos(): HasMany
    {
        return $this->hasMany(Atendimento::class, 'user_id');
    }

    /* -----------------------------------------------------------------
    |   ROLES
    |  -----------------------------------------------------------------
     */

    public function isMaster(): bool
    {
        return $this->role === 'master';
    }

    public function isAdmin(): bool
    {
        return in_array($this->role, ['admin', 'master'], true);
    }

    public function isAtendente(): bool
    {
        return $this->role === 'atendente';
    }

    /* -----------------------------------------------------------------
    |   Proxy de Permissões
    |  -----------------------------------------------------------------
    */
    public function hasPermission(string $permissionKey, ?TipoAtendimento $tipoAtendimento = null): bool
    {
        return app(PermissionService::class)->can($this, $permissionKey, $tipoAtendimento);
    }

    public function modo(TipoAtendimento $tipo): ?string
    {
        return app(PermissionService::class)
            ->modo($this, $tipo);
    }
}


