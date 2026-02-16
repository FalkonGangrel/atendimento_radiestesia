<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cliente extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'clientes';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'whatsapp',
        'birth_date',
        'observation',
        'user_id',
    ];

    protected $casts = [
        'birth_date' => 'date',
    ];

    public function atendente(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id')->withTrashed();
    }

    public function atendimentos(): HasMany
    {
        return $this->hasMany(TemplateAtendimento::class, 'cliente_id');
    }

    public function scopeOwnedBy($query, $user)
    {
        if ($user->is_master) {
            return $query;
        }

        return $query->where('user_id', $user->id);
    }

}
