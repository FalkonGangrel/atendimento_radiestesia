<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserFieldPermission extends Model
{
    protected $fillable = [
        'user_id',
        'custom_field_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function customField(): BelongsTo
    {
        return $this->belongsTo(CustomField::class);
    }
}
