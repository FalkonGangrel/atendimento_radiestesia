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
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'whatsapp' => $this->whatsapp,
            'birth_date' => optional($this->birth_date)->format('Y-m-d'),
            'observation' => $this->observation,
            'active' => (bool) is_null($this->deleted_at),

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
