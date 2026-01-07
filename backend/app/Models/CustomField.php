<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CustomField extends Model
{
    protected $table = 'custom_fields';

    protected $fillable = [
        'section_id',
        'name',
        'slug',
        'type',
        'options',
        'order',
        'is_required',
        'active',
    ];

    protected $casts = [
        'options' => 'array',
        'is_required' => 'boolean',
        'active' => 'boolean',
    ];

    public function section(): BelongsTo
    {
        return $this->belongsTo(FieldSection::class, 'section_id');
    }

    public function permissions(): HasMany
    {
        return $this->hasMany(UserFieldPermission::class);
    }

    public function tiposAtendimento(): BelongsToMany
    {
        return $this->belongsToMany(TipoAtendimento::class, 'tipo_atendimento_custom_field')
            ->withPivot('ordem')
            ->withTimestamps();
    }
}
