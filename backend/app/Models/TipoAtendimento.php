<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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

    // Atendimentos deste tipo
    public function atendimentos(): HasMany
    {
        return $this->hasMany(TemplateAtendimento::class, 'tipo_atendimento_id');
    }

    // Usuários que têm permissão para este tipo
    public function usersWithPermission(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_tipo_atendimento_permissions')
            ->withTimestamps();
    }

    // Campos customizados vinculados a este tipo
    public function customFields(): BelongsToMany
    {
        return $this->belongsToMany(CustomField::class, 'tipo_atendimento_custom_field')
            ->withPivot('ordem')
            ->withTimestamps()
            ->orderBy('tipo_atendimento_custom_field.ordem');
    }

    // Listas vinculadas a este tipo
    public function lists(): BelongsToMany
    {
        return $this->belongsToMany(ListModel::class, 'tipo_atendimento_list', 'tipo_atendimento_id', 'list_id')
            ->withPivot('ordem')
            ->withTimestamps()
            ->orderBy('tipo_atendimento_list.ordem');
    }

    // Itens de lista vinculados a este tipo
    public function listItems(): BelongsToMany
    {
        return $this->belongsToMany(ListItem::class, 'tipo_atendimento_list_item')
            ->withTimestamps();
    }
}
