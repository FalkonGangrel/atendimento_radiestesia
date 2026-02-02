<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
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

    public function tiposAtendimentoPermitidos(): BelongsToMany
    {
        return $this->belongsToMany(
            TipoAtendimento::class,
            'user_tipo_atendimento_permissions'
        )->withTimestamps();
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
        return $this->hasMany(TemplateAtendimento::class, 'user_id');
    }

    /* -----------------------------------------------------------------
    |   ROLES
    |  -----------------------------------------------------------------
     */

    public function isMaster(): bool
    {
        return $this->role === 'master';
    }

    public function isAtendente(): bool
    {
        return $this->role === 'atendente';
    }

    /* -----------------------------------------------------------------
    |   PERMISSÕES
    |  -----------------------------------------------------------------
     */

    /**
     * Retorna a lista de permissões do usuário baseada na role.
     */
    public function permissions(): array
    {
        $map = config('permissions');

        return $map[$this->role] ?? [];
    }

    /**
     * Verifica se o usuário possui determinada permissão.
     */
    public function hasPermission(string $permission): bool
    {
        // Fail-safe: Master sempre pode tudo
        if ($this->isMaster()) {
            return true;
        }

        return in_array($permission, $this->permissions(), true);
    }

    /**
     * Verifica permissão para um Tipo de Atendimento específico.
     */
    public function hasPermissionForTipo(int $tipoId): bool
    {
        // Master tem acesso a todos os tipos
        if ($this->isMaster()) {
            return true;
        }

        return $this->tiposAtendimentoPermitidos()
            ->where('tipos_atendimento.id', $tipoId)
            ->exists();
    }
}
