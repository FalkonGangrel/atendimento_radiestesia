<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClienteController extends Controller
{
    /**
     * Listar clientes do atendente logado
     */
    public function index()
    {
        $userId = Auth::id();

        $clientes = Cliente::where('user_id', $userId)
            ->where('ativo', true)
            ->orderBy('nome')
            ->get();

        return response()->json($clientes);
    }

    /**
     * Mostrar um cliente específico
     */
    public function show($id)
    {
        $userId = Auth::id();

        $cliente = Cliente::where('id', $id)
            ->where('user_id', $userId)
            ->firstOrFail();

        return response()->json($cliente);
    }

    /**
     * Criar novo cliente
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'telefone' => 'nullable|string|max:20',
            'whatsapp' => 'nullable|string|max:20',
            'data_nascimento' => 'nullable|date',
            'observacoes' => 'nullable|string',
        ]);

        $validated['user_id'] = Auth::id();

        $cliente = Cliente::create($validated);

        return response()->json($cliente, 201);
    }

    /**
     * Atualizar cliente
     */
    public function update(Request $request, $id)
    {
        $userId = Auth::id();

        $cliente = Cliente::where('id', $id)
            ->where('user_id', $userId)
            ->firstOrFail();

        $validated = $request->validate([
            'nome' => 'sometimes|required|string|max:255',
            'email' => 'nullable|email|max:255',
            'telefone' => 'nullable|string|max:20',
            'whatsapp' => 'nullable|string|max:20',
            'data_nascimento' => 'nullable|date',
            'observacoes' => 'nullable|string',
            'ativo' => 'sometimes|boolean',
        ]);

        $cliente->update($validated);

        return response()->json($cliente);
    }

    /**
     * Deletar cliente (soft delete - marca como inativo)
     */
    public function destroy($id)
    {
        $userId = Auth::id();

        $cliente = Cliente::where('id', $id)
            ->where('user_id', $userId)
            ->firstOrFail();

        $cliente->update(['ativo' => false]);

        return response()->json(['message' => 'Cliente desativado com sucesso']);
    }
}
