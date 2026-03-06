<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TipoAtendimentoResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'              => $this->id,
            'nome'            => $this->nome,
            'slug'            => $this->slug,
            'descricao'       => $this->descricao,
            'valor'           => $this->valor,
            'duracao_minutos' => $this->duracao_minutos,
            'ativo'           => $this->ativo,
            'ordem'           => $this->ordem,
            'deleted_at'      => $this->deleted_at,
            'created_at'      => $this->created_at,
        ];
    }
}