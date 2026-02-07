<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Permission extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'label',
    ];

    public function userTipoPermissions(): HasMany
    {
        return $this->hasMany(UserTipoPermission::class);
    }
}
