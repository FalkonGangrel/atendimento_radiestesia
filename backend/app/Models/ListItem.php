<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Model;

class ListItem extends Model
{
    protected $fillable = ['list_id', 'name', 'has_quantity'];

    protected $casts = [
        'has_quantity' => 'boolean',
    ];

    public function list()
    {
        return $this->belongsTo(ListModel::class);
    }

    public function tiposAtendimento(): BelongsToMany
    {
        return $this->belongsToMany(TipoAtendimento::class, 'tipo_atendimento_list_item')
            ->withTimestamps();
    }
}
