<?php

namespace App\Http\Controllers;

use App\Models\TipoAtendimento;
use App\Http\Requests\StoreTipoAtendimentoRequest;
use App\Http\Resources\TipoAtendimentoResource;
use App\Http\Resources\TipoAtendimentoEstruturaResource;
use App\Services\TipoAtendimentoService;
use Illuminate\Http\Request;

class TipoAtendimentoController extends Controller
{
    /**
     * Listagem completa — apenas superusuários (master/admin).
     */
    public function index()
    {
        $this->authorize('viewAny', TipoAtendimento::class);

        $tipos = TipoAtendimento::where('ativo', true)
            ->orderBy('ordem')
            ->orderBy('nome')
            ->get();

        return TipoAtendimentoResource::collection($tipos);
    }

    /**
     * Listagem simplificada — qualquer autenticado.
     * O scope permitidoPara filtra automaticamente os tipos acessíveis ao usuário.
     * Master/admin veem todos; atendentes veem apenas os que têm permissão.
     */
    public function indexSimplificado()
    {
        $tipos = TipoAtendimento::where('ativo', true)
            ->permitidoPara(auth()->user())
            ->orderBy('ordem')
            ->orderBy('nome')
            ->get();

        return TipoAtendimentoResource::collection($tipos);
    }

    public function store(StoreTipoAtendimentoRequest $request)
    {
        $tipo = TipoAtendimento::create($request->validated());

        return new TipoAtendimentoResource($tipo);
    }

    public function show(TipoAtendimento $tipoAtendimento)
    {
        $this->authorize('view', $tipoAtendimento);

        return response()->json($tipoAtendimento);
    }

    public function update(Request $request, TipoAtendimento $tipoAtendimento)
    {
        $this->authorize('update', $tipoAtendimento);

        $tipoAtendimento->update(
            $request->validate([
                'nome'             => 'sometimes|required|string|max:255',
                'slug'             => 'sometimes|required|string|max:255|unique:tipos_atendimento,slug,' . $tipoAtendimento->id,
                'descricao'        => 'nullable|string',
                'valor'            => 'sometimes|required|numeric|min:0',
                'duracao_minutos'  => 'nullable|integer|min:0',
                'ativo'            => 'boolean',
                'ordem'            => 'integer|min:0',
            ])
        );

        return response()->json($tipoAtendimento);
    }

    public function destroy(TipoAtendimento $tipoAtendimento)
    {
        $this->authorize('delete', $tipoAtendimento);

        $tipoAtendimento->delete();

        return response()->json(['message' => 'Tipo de atendimento deletado com sucesso']);
    }

    public function estrutura(TipoAtendimento $tipo, TipoAtendimentoService $service)
    {
        $this->authorize('use', $tipo);

        $tipo = $service->carregarEstrutura($tipo);

        return new TipoAtendimentoEstruturaResource($tipo);
    }
}