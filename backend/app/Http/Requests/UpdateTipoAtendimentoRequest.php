<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTipoAtendimentoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('tipoAtendimento'));
    }

    public function rules(): array
    {
        $id = $this->route('tipoAtendimento')->id;

        return [
            'nome' => 'sometimes|required|string|max:255',
            'slug' => "sometimes|required|string|max:255|unique:tipos_atendimento,slug,$id",
            'descricao' => 'nullable|string',
            'valor' => 'sometimes|required|numeric|min:0',
            'duracao_minutos' => 'nullable|integer|min:0',
            'ativo' => 'boolean',
            'ordem' => 'integer|min:0',
        ];
    }
}
