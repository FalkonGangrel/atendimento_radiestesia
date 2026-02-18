<?php

namespace App\Services;

use App\Models\User;
use App\Models\TipoAtendimento;

class TipoAtendimentoService
{
    public function listarDisponiveisPara(User $user)
    {
        if ($user->isMaster()) {
            return TipoAtendimento::ativo()->ordenado()->get();
        }

        return TipoAtendimento::ativo()
            ->whereHas('permissions', function ($q) use ($user) {
                $q->where('user_id', $user->id)
                  ->where('allowed', true)
                  ->whereHas('permission', fn($p) => $p->where('slug', 'use'));
            })
            ->ordenado()
            ->get();
    }

    public function criar(array $data): TipoAtendimento
    {
        return TipoAtendimento::create($data);
    }

    public function atualizar(TipoAtendimento $tipo, array $data): TipoAtendimento
    {
        $tipo->update($data);
        return $tipo;
    }

    public function carregarEstrutura(TipoAtendimento $tipo): TipoAtendimento
    {
        return $tipo->load([
            'customFields',
            'lists.listItems',
        ]);
    }
}

