<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserTipoPermission extends Model
{
    use HasFactory;

    protected $table = 'user_tipo_permissions';

    protected $fillable = [
        'user_id',
        'tipo_atendimento_id',
        'permission_id',
        'allowed',
    ];

    protected $casts = [
        'allowed' => 'boolean',
    ];

    /**
     * Usuário dono da permissão
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Tipo de atendimento
     */
    public function tipoAtendimento(): BelongsTo
    {
        return $this->belongsTo(TipoAtendimento::class);
    }

    /**
     * Permissão base
     */
    public function permission(): BelongsTo
    {
        return $this->belongsTo(Permission::class);
    }
}
