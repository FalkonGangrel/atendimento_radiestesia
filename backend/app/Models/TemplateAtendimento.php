<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TemplateAtendimento extends Model
{
    protected $table = 'template_atendimento';

    protected $fillable = [
        'user_id',
        'cliente_id',
        'tipo_atendimento_id',
        'valor_cobrado',
        'patient_name',
        'birth_date',
        'attendance_date',
        'treatment_focus',
        'observations',
        'tables_needed',
        'lines_to_clean',
        'fractals_percent',
        'treatment_duration_days',
        'has_directives',
        'has_ancestralidade',
        'has_rco',
        'status',
        'custom_data',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'attendance_date' => 'date',
        'has_directives' => 'boolean',
        'has_ancestralidade' => 'boolean',
        'has_rco' => 'boolean',
        'custom_data' => 'array',
        'valor_cobrado' => 'float',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class);
    }

    public function tipoAtendimento(): BelongsTo
    {
        return $this->belongsTo(TipoAtendimento::class, 'tipo_atendimento_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(AtendimentoItem::class, 'template_atendimento_id');
    }
}
