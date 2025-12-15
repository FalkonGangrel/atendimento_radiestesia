<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ListItem extends Model
{
    protected $fillable = [
        'list_id',
        'name',
        'has_quantity',
        'active',
        'order',
    ];

    protected $casts = [
        'has_quantity' => 'boolean',
        'active' => 'boolean',
    ];

    public function list(): BelongsTo
    {
        return $this->belongsTo(ListModel::class, 'list_id');
    }
}