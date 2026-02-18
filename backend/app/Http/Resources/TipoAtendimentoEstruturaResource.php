<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\CustomFieldResource;
use App\Http\Resources\ListItemResource;

class TipoAtendimentoEstruturaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'valor_padrao' => $this->valor,
            'duracao_padrao' => $this->duracao_minutos,

            'campos' => CustomFieldResource::collection($this->customFields),

            'listas' => $this->lists->map(function ($list) {
                return [
                    'id' => $list->id,
                    'nome' => $list->nome,
                    'itens' => ListItemResource::collection($list->listItems),
                ];
            }),
        ];
    }
}
