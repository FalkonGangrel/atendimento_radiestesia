<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListItem extends Model
{
    protected $fillable = ['list_id', 'name', 'has_quantity'];

    protected $casts = [
        'has_quantity' => 'boolean',
    ];

    public function list()
    {
        return $this->belongsTo(Lists::class);
    }
}
