<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FieldSection extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'order',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];

    public function fields(): HasMany
    {
        return $this->hasMany(CustomField::class, 'section_id')->orderBy('order');
    }
}
