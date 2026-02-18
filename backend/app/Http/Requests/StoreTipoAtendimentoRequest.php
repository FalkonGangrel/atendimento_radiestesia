<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\TipoAtendimento;

class StoreTipoAtendimentoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', TipoAtendimento::class);
    }

    public function rules(): array
    {
        return [
            'nome' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:tipos_atendimento,slug',
            'descricao' => 'nullable|string',
            'valor' => 'required|numeric|min:0',
            'duracao_minutos' => 'nullable|integer|min:0',
            'ativo' => 'boolean',
            'ordem' => 'integer|min:0',
        ];
    }
}
