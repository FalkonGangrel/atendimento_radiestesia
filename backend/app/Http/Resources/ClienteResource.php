<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class ClienteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // Último atendimento já vem eager-loaded no controller via with(['atendimentos'...])
        // Evita N+1: não chamar ->atendimentos()->query() aqui.
        $ultimoAtendimento = $this->atendimentos->first();

        return [
            'id'         => $this->id,
            // user_id removido — o frontend usa created_by.id para ownership
            'name'       => $this->name,
            'email'      => $this->email,
            'phone'      => $this->phone,
            'whatsapp'   => $this->whatsapp,
            'birth_date' => optional($this->birth_date)->format('Y-m-d'),
            'observation'=> $this->observation,
            'deleted_at' => $this->deleted_at, // frontend usa deleted_at para exibir "Inativo"
            'active'     => is_null($this->deleted_at),

            // created_by sempre carregado — contém o user_id como id
            // O frontend usa created_by.id para controle de ownership
            'created_by' => $this->when(
                $this->relationLoaded('atendente') && $this->atendente,
                fn () => [
                    'id'    => $this->atendente->id,
                    'name'  => $this->atendente->name,
                    'email' => $this->atendente->email,
                ]
            ),

            // Usando a relação já carregada — sem queries adicionais
            'ultimo_atendimento' => optional($ultimoAtendimento)?->data_atendimento,
            'data_retorno'       => optional($ultimoAtendimento)?->data_retorno,
            'observacao_resumo'  => Str::limit(
                optional($ultimoAtendimento)?->observacao, 30
            ),
        ];
    }
}