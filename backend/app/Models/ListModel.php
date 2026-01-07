<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ListModel extends Model
{
    protected $table = 'lists';

    protected $fillable = [
        'name',
        'slug',
        'created_by',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(ListItem::class, 'list_id')->orderBy('order');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function tiposAtendimento(): BelongsToMany
    {
        return $this->belongsToMany(TipoAtendimento::class, 'tipo_atendimento_list', 'list_id', 'tipo_atendimento_id')
            ->withPivot('ordem')
            ->withTimestamps();
    }

}