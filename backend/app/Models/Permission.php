<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;


class Permission extends Model
{
    protected $fillable = [
        'key',
        'label',
    ];

    public function userTipoPermissions(): HasMany
    {
        return $this->hasMany(UserTipoPermission::class);
    }
}
