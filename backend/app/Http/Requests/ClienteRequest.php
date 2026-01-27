<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ClienteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // controle de acesso vem depois (Policies)
    }

    public function rules(): array
    {
        $clienteId = $this->route('cliente');

        return [
            'nome' => ['required', 'string', 'min:3', 'max:255'],
            'email' => [
                'nullable',
                'email',
                'max:255',
                'unique:clientes,email,' . $clienteId,
            ],
            'telefone' => ['required', 'string', 'min:8', 'max:20'],
            'whatsapp' => ['nullable', 'string', 'min:8', 'max:20'],
            'data_nascimento' => ['nullable', 'date'],
            'observacoes' => ['nullable', 'string'],
            'ativo' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'nome.required' => 'O nome é obrigatório',
            'nome.min' => 'O nome deve ter no mínimo 3 caracteres',
            'email.email' => 'Informe um e-mail válido',
            'email.unique' => 'Este e-mail já está cadastrado',
            'telefone.required' => 'O telefone é obrigatório',
        ];
    }
}
