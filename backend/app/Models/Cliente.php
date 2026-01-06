<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cliente extends Model
{
    protected $table = 'clientes';

    protected $fillable = [
        'user_id',
        'nome',
        'email',
        'telefone',
        'whatsapp',
        'data_nascimento',
        'observacoes',
        'ativo',
    ];

    protected $casts = [
        'data_nascimento' => 'date',
        'ativo' => 'boolean',
    ];

    public function atendente(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function atendimentos(): HasMany
    {
        return $this->hasMany(Atendimento::class, 'cliente_id');
    }
}
