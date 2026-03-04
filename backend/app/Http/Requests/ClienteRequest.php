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
        $cliente  = $this->route('cliente');
        $clienteId = $cliente?->id;
        $userId   = auth()->id();

        return [
            'name'        => ['required', 'string', 'min:3', 'max:255'],
            'email'       => [
                'nullable',
                'email',
                'max:255',
                // Único apenas dentro dos clientes do mesmo usuário
                Rule::unique('clientes', 'email')
                    ->whereNull('deleted_at')
                    ->where('user_id', $userId)
                    ->ignore($clienteId),
            ],
            'phone'       => ['nullable', 'string', 'min:8', 'max:20'],
            'whatsapp'    => ['nullable', 'string', 'min:8', 'max:20'],
            'birth_date'  => ['nullable', 'date'],
            'observation' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'O nome é obrigatório.',
            'name.min'      => 'O nome deve ter no mínimo 3 caracteres.',
            'email.email'   => 'Informe um e-mail válido.',
            'email.unique'  => 'Você já possui um cliente cadastrado com este e-mail.',
        ];
    }
}