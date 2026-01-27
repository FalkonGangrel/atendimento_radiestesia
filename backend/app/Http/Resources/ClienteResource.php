<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClienteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->nome,
            'email' => $this->email,
            'telefone' => $this->telefone,
            'whatsapp' => $this->whatsapp,
            'birth_date' => optional($this->data_nascimento)->format('Y-m-d'),
            'observacoes' => $this->observacoes,
            'active' => (bool) $this->ativo,

            'created_by' => $this->when(
                $this->relationLoaded('atendente') && $this->atendente,
                fn () => [
                    'id' => $this->atendente->id,
                    'name' => $this->atendente->name,
                    'email' => $this->atendente->email,
                ]
            ),
        ];
    }
}
