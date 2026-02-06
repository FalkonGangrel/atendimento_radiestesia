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

    public function index(Request $request)
    {
        $this->authorize('viewAny', Cliente::class);

        $clientes = Cliente::query()
            ->with(['atendente:id,name,email'])
            ->orderBy('nome')
            ->get();

        return ClienteResource::collection($clientes);
    }

    public function show(Cliente $cliente)
    {
        return new ClienteResource($cliente->loadMissing(
            auth()->user()->isMaster()
                ? ['atendente:id,name,email']
                : []
        ));
    }

    public function store(ClienteRequest $request)
    {
        $cliente = Cliente::create([
            ...$request->validated(),
            'user_id' => auth()->id(),
        ]);

        return new ClienteResource($cliente);
    }

    public function update(ClienteRequest $request, Cliente $cliente)
    {
        $cliente->update($request->validated());

        return new ClienteResource($cliente->fresh());
    }

    public function destroy(Cliente $cliente)
    {
        $cliente->update(['ativo' => false]);

        return response()->json(['message' => 'Cliente desativado com sucesso']);
    }
}
