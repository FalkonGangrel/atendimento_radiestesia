<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Http\Resources\ClienteResource;
use App\Http\Requests\ClienteRequest;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Cliente::class, 'cliente');
    }

    /**
     * Listagem de clientes
     * - Master: todos + quem cadastrou
     * - Outros: apenas os próprios
     */
    public function index(Request $request)
    {
        $user = auth()->user();

        $query = Cliente::query()
            ->where('ativo', true)
            ->orderBy('nome');

        if ($user->isMaster()) {
            $query->with('atendente:id,name,email');

            if ($request->filled('user_id')) {
                $query->where('user_id', $request->user_id);
            }
        } else {
            $query->where('user_id', $user->id);
        }

        return ClienteResource::collection($query->get());
    }



    /**
     * Visualizar cliente
     */
    public function show(Cliente $cliente)
    {
        if (auth()->user()->isMaster()) {
            $cliente->load('atendente:id,name,email');
        }

        return new ClienteResource($cliente);
    }


    /**
     * Criar cliente
     */
    public function store(ClienteRequest $request)
    {
        $cliente = Cliente::create([
            ...$request->validated(),
            'created_by' => auth()->id(),
        ]);

        return new ClienteResource($cliente);
    }

    /**
     * Atualizar cliente
     */
    public function update(ClienteRequest $request, Cliente $cliente)
    {
        $cliente->update($request->validated());

        return new ClienteResource($cliente->fresh());
    }

    /**
     * Desativar cliente
     */
    public function destroy(Cliente $cliente)
    {
        $cliente->update(['ativo' => false]);

        return response()->json(['message' => 'Cliente desativado com sucesso']);
    }
}
