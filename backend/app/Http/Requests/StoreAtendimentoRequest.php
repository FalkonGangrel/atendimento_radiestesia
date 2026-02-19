<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\TipoAtendimento;

class StoreAtendimentoRequest extends FormRequest
{
    public function authorize(): bool
    {
        $tipoId = $this->input('tipo_atendimento_id');
        $tipo = TipoAtendimento::findOrFail($tipoId);
        
        if (!$tipo) {
            return false;
            }
            
        return $this->user()->can('create', $tipo);
    }

    public function rules(): array
    {
        return [
            'cliente_id' => 'required|exists:clientes,id',
            'tipo_atendimento_id' => 'required|exists:tipos_atendimento,id',
            'data_atendimento' => 'required|date',
            'data_retorno' => 'nullable|date|after_or_equal:data_atendimento',
            'observacao' => 'nullable|string',
        ];
    }
}