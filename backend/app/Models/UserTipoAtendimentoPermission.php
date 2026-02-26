<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserTipoAtendimentoPermission extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'tipo_atendimento_id',
        'permission_id',
        'allowed',
        'modo',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function tipo(): BelongsTo
    {
        return $this->belongsTo(TipoAtendimento::class);
    }

    public function permission(): BelongsTo
    {
        return $this->belongsTo(Permission::class);
    }

}
