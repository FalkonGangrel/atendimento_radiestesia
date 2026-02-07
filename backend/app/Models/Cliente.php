<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cliente extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'clientes';

    protected $fillable = [
        'nome',
        'email',
        'telefone',
        'whatsapp',
        'data_nascimento',
        'observacoes',
        'user_id',
    ];

    protected $casts = [
        'data_nascimento' => 'date',
    ];

    public function atendente(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id')->withTrashed();
    }

    public function atendimentos(): HasMany
    {
        return $this->hasMany(TemplateAtendimento::class, 'cliente_id');
    }
}
