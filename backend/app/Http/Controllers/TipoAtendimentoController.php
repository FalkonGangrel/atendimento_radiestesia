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
     * Listagem completa para master — ativos e inativos (soft deleted inclusive).
     */
    public function index()
    {
        $this->authorize('viewAny', TipoAtendimento::class);

        $tipos = TipoAtendimento::withTrashed()
            ->orderBy('ordem')
            ->orderBy('nome')
            ->get();

        return TipoAtendimentoResource::collection($tipos);
    }

    /**
     * Listagem simplificada — apenas ativos, filtrada por permissão do usuário.
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

        return new TipoAtendimentoResource($tipoAtendimento);
    }

    public function update(Request $request, TipoAtendimento $tipoAtendimento)
    {
        $this->authorize('update', $tipoAtendimento);

        $tipoAtendimento->update(
            $request->validate([
                'nome'            => 'sometimes|required|string|max:255',
                'slug'            => 'sometimes|required|string|max:255|unique:tipos_atendimento,slug,' . $tipoAtendimento->id,
                'descricao'       => 'nullable|string',
                'valor'           => 'sometimes|required|numeric|min:0',
                'duracao_minutos' => 'nullable|integer|min:0',
                'ativo'           => 'boolean',
                'ordem'           => 'integer|min:0',
            ])
        );

        return new TipoAtendimentoResource($tipoAtendimento->fresh());
    }

    /**
     * Soft delete — desativa o tipo sem remover do banco.
     */
    public function destroy(TipoAtendimento $tipoAtendimento)
    {
        $this->authorize('delete', $tipoAtendimento);

        $tipoAtendimento->delete();

        return response()->json(['message' => 'Tipo de atendimento desativado com sucesso.']);
    }

    /**
     * Restaura um tipo soft-deleted.
     */
    public function restore(int $id)
    {
        $tipo = TipoAtendimento::withTrashed()->findOrFail($id);

        $this->authorize('delete', $tipo); // reutiliza a mesma gate de gerenciamento

        $tipo->restore();
        $tipo->update(['ativo' => true]);

        return new TipoAtendimentoResource($tipo->fresh());
    }

    public function estrutura(TipoAtendimento $tipo, TipoAtendimentoService $service)
    {
        $this->authorize('use', $tipo);

        $tipo = $service->carregarEstrutura($tipo);

        return new TipoAtendimentoEstruturaResource($tipo);
    }
}