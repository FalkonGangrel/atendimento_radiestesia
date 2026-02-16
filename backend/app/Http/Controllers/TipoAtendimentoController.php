<?php

namespace App\Http\Controllers;

use App\Models\TipoAtendimento;
use Illuminate\Http\Request;

class TipoAtendimentoController extends Controller
{
    public function index()
    {
        $this->authorize('view', TipoAtendimento::class);

        $query = TipoAtendimento::where('ativo', true)
            ->orderBy('ordem')
            ->orderBy('nome');

        if (!auth()->user()->isMaster()) {
            $query->whereHas('userPermissions', function ($q) {
                $q->where('user_id', auth()->id())
                ->where('allowed', true);
            });
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $this->authorize('create', TipoAtendimento::class);

        $tipo = TipoAtendimento::create(
            $request->validate([
                'nome' => 'required|string|max:255',
                'slug' => 'required|string|max:255|unique:tipos_atendimento,slug',
                'descricao' => 'nullable|string',
                'valor' => 'required|numeric|min:0',
                'duracao_minutos' => 'nullable|integer|min:0',
                'ativo' => 'boolean',
                'ordem' => 'integer|min:0',
            ])
        );

        return response()->json($tipo, 201);
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
                'nome' => 'sometimes|required|string|max:255',
                'slug' => 'sometimes|required|string|max:255|unique:tipos_atendimento,slug,' . $tipoAtendimento->id,
                'descricao' => 'nullable|string',
                'valor' => 'sometimes|required|numeric|min:0',
                'duracao_minutos' => 'nullable|integer|min:0',
                'ativo' => 'boolean',
                'ordem' => 'integer|min:0',
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
}
