<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AtendimentoItem extends Model
{
    protected $table = 'atendimento_items';

    protected $fillable = [
        'user_id',
        'atendimento_table',
        'atendimento_id',
        'list_item_id',
        'quantity',
    ];

    protected $casts = [
        'quantity' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function listItem(): BelongsTo
    {
        return $this->belongsTo(ListItem::class);
    }
}
