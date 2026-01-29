<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ClienteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $cliente = $this->route('cliente');

        return [
            'name' => ['required', 'string', 'min:3', 'max:255'],
            'email' => [
                'nullable',
                'email',
                'max:255',
                Rule::unique('clientes', 'email')->ignore($cliente),
            ],
            'telefone' => ['nullable', 'string', 'min:8', 'max:20'],
            'whatsapp' => ['nullable', 'string', 'min:8', 'max:20'],
            'birth_date' => ['nullable', 'date'],
            'observacoes' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'O nome é obrigatório',
            'name.min' => 'O nome deve ter no mínimo 3 caracteres',
            'email.email' => 'Informe um e-mail válido',
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'nome',
            'telefone' => 'telefone',
            'data_nascimento' => 'data de nascimento',
        ];
    }
}
