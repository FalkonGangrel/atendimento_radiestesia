<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TipoAtendimento extends Model
{
    protected $table = 'tipos_atendimento';

    protected $fillable = [
        'nome',
        'slug',
        'descricao',
        'valor',
        'duracao_minutos',
        'ativo',
        'ordem',
    ];

    protected $casts = [
        'valor' => 'float',
        'ativo' => 'boolean',
    ];

    public function atendimentos(): HasMany
    {
        return $this->hasMany(Atendimento::class, 'tipo_atendimento_id');
    }
}
