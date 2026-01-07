<?php

namespace App\Http\Controllers;

use App\Models\TipoAtendimento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TipoAtendimentoController extends Controller
{
    /**
     * Listar tipos de atendimento permitidos para o usuário logado.
     * Masters veem todos, atendentes veem apenas os permitidos.
     */
    public function index()
    {
        $user = Auth::user();

        if ($user->isMaster()) {
            // Master vê todos os tipos ativos
            $tipos = TipoAtendimento::where('ativo', true)
                ->orderBy('ordem')
                ->orderBy('nome')
                ->get();
        } else {
            $tipos = $user->tiposAtendimentoPermitidos()
                ->where('ativo', true)
                ->orderBy('ordem')
                ->orderBy('nome')
                ->get();
        }

        return response()->json($tipos);
    }

    /**
     * Criar novo tipo (APENAS MASTER)
     */
    public function store(Request $request)
    {
        // Autorização via Policy: A TipoAtendimentoPolicy já garante que apenas Masters podem criar
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
     * Mostrar um tipo específico (com autorização via Policy)
     */
    public function show($id)
    {
        $tipo = TipoAtendimento::findOrFail($id);

        // Autorização via Policy: Garante que o usuário tem permissão para visualizar este tipo específico
        $this->authorize('view', $tipo);

        return response()->json($tipo);
    }

    /**
     * Atualizar tipo (APENAS MASTER, com autorização via Policy na instância)
     */
    public function update(Request $request, $id)
    {
        $tipo = TipoAtendimento::findOrFail($id);

        $this->authorize('update', $tipo);

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
     * Deletar tipo (APENAS MASTER, com autorização via Policy na instância)
     */
    public function destroy($id)
    {
        $tipo = TipoAtendimento::findOrFail($id);

        $this->authorize('delete', $tipo);

        $tipo->delete();

        return response()->json(['message' => 'Tipo de atendimento deletado com sucesso']);
    }
}
