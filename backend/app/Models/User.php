<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

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
    ];

    public function tiposAtendimentoPermitidos(): BelongsToMany
    {
        return $this->belongsToMany(TipoAtendimento::class, 'user_tipo_atendimento_permissions')
            ->withTimestamps();
    }

    public function isMaster(): bool
    {
        return $this->role === 'master';
    }

    public function isAtendente(): bool
    {
        return $this->role === 'atendente';
    }

    public function clientes(): HasMany
    {
        return $this->hasMany(Cliente::class, 'user_id');
    }

    public function atendimentos(): HasMany
    {
        return $this->hasMany(TemplateAtendimento::class, 'user_id');
    }

    public function permissions(): array
    {
        $map = config('permissions');

        return $map[$this->role] ?? [];
    }

    public function hasPermission(string $permission): bool
    {
        return in_array($permission, $this->permissions(), true);
    }

    public function hasPermissionForTipo(int $tipoId): bool
    {
        if ($this->isMaster()) {
            return true;
        }

        return $this->tiposAtendimentoPermitidos()
            ->where('tipos_atendimento.id', $tipoId)
            ->exists();
    }
}
