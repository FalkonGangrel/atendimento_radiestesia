<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AtendimentoResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'cliente_id' => $this->cliente_id,
            'tipo' => $this->when(
                $this->relationLoaded('tipo') && $this->tipo,
                fn () => [
                    'id' => $this->tipo->id,
                    'nome' => $this->tipo->nome,
                    'slug' => $this->tipo->slug,
                    'valor' => $this->tipo->valor,
                ]
            ),
            'data_atendimento' => optional($this->data_atendimento)->format('Y-m-d'),
            'data_retorno' => optional($this->data_retorno)->format('Y-m-d'),
            'observacao' => $this->observacao,
            'created_at' => $this->created_at,
        ];
    }
}