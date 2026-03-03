<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Atendimento extends Model
{
    protected $fillable = [
        'cliente_id',
        'user_id',
        'tipo_atendimento_id',
        'data_atendimento',
        'data_retorno',
        'observacao',
        'retorno_concluido',
    ];

    protected $casts = [
        'data_atendimento' => 'date',
        'data_retorno' => 'date',
    ];

    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tipo()
    {
        return $this->belongsTo(TipoAtendimento::class, 'tipo_atendimento_id');
    }
}
