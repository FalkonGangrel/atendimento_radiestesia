<?php

namespace App\Http\Controllers;

use App\Models\TipoAtendimento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TipoAtendimentoController extends Controller
{
    /**
     * Listar todos os tipos de atendimento (TODOS os usuários)
     */
    public function index()
    {
        $tipos = TipoAtendimento::where('ativo', true)
            ->orderBy('ordem')
            ->get();

        return response()->json($tipos);
    }

    /**
     * Criar novo tipo (APENAS MASTER)
     */
    public function store(Request $request)
    {
        $this->authorize('create', TipoAtendimento::class);

        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:tipos_atendimento,slug',
            'descricao' => 'nullable|string',
            'valor' => 'required|numeric|min:0',
            'duracao_minutos' => 'nullable|integer|min:0',
            'ativo' => 'boolean',
            'ordem' => 'integer|min:0',
        ]);

        $tipo = TipoAtendimento::create($validated);

        return response()->json($tipo, 201);
    }

    /**
     * Mostrar um tipo específico
     */
    public function show($id)
    {
        $tipo = TipoAtendimento::findOrFail($id);
        return response()->json($tipo);
    }

    /**
     * Atualizar tipo (APENAS MASTER)
     */
    public function update(Request $request, $id)
    {
        $this->authorize('update', TipoAtendimento::class);

        $tipo = TipoAtendimento::findOrFail($id);

        $validated = $request->validate([
            'nome' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:tipos_atendimento,slug,' . $id,
            'descricao' => 'nullable|string',
            'valor' => 'sometimes|required|numeric|min:0',
            'duracao_minutos' => 'nullable|integer|min:0',
            'ativo' => 'sometimes|boolean',
            'ordem' => 'sometimes|integer|min:0',
        ]);

        $tipo->update($validated);

        return response()->json($tipo);
    }

    /**
     * Deletar tipo (APENAS MASTER)
     */
    public function destroy($id)
    {
        $this->authorize('delete', TipoAtendimento::class);

        $tipo = TipoAtendimento::findOrFail($id);
        $tipo->delete();

        return response()->json(['message' => 'Tipo de atendimento deletado com sucesso']);
    }
}
