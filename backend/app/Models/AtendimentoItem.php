<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AtendimentoItem extends Model
{
    protected $table = 'atendimento_items';

    protected $fillable = [
        'template_atendimento_id',
        'list_item_id',
        'quantity',
    ];

    protected $casts = [
        'quantity' => 'integer',
    ];

    public function atendimento(): BelongsTo
    {
        return $this->belongsTo(TemplateAtendimento::class, 'template_atendimento_id');
    }

    public function listItem(): BelongsTo
    {
        return $this->belongsTo(ListItem::class);
    }
}
