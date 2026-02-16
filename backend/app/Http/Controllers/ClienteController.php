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

        $query = Cliente::query()
            ->ownedBy(auth()->user())
            ->with('atendente');

        // filtro por ativo/inativo
        if ($request->has('active')) {
            if ($request->boolean('active')) {
                $query->whereNull('deleted_at');
            } else {
                $query->onlyTrashed();
            }
        }

        // busca por nome
        if ($search = $request->get('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        $clientes = $query->latest()->paginate(20);

        return ClienteResource::collection($clientes);
    }

    public function show(Cliente $cliente)
    {
        return new ClienteResource(
            $cliente->loadMissing('atendente:id,name,email')
        );
    }

    public function store(ClienteRequest $request)
    {

        $cliente = Cliente::create([
            ...$request->validated(),
            'user_id' => auth()->id(),
            'ativo' => true,
        ]);

        return new ClienteResource($cliente->load('atendente:id,name,email'));
    }

    public function update(ClienteRequest $request, Cliente $cliente)
    {
        $this->authorize('update', $cliente);

        $cliente->update($request->validated());

        return new ClienteResource($cliente->load('atendente'));
    }

    public function destroy(Cliente $cliente)
    {
        $this->authorize('delete', $cliente);

        $cliente->delete();

        return response()->json([
            'message' => 'Cliente desativado com sucesso.'
        ]);
    }

    public function restore($id)
    {
        $cliente = Cliente::withTrashed()
            ->ownedBy(auth()->user())
            ->findOrFail($id);

        $this->authorize('restore', $cliente);

        $cliente->restore();

        return new ClienteResource($cliente);
    }

    public function forceDelete($id)
    {
        $cliente = Cliente::withTrashed()
            ->ownedBy(auth()->user())
            ->findOrFail($id);

        $this->authorize('forceDelete', $cliente);

        $cliente->forceDelete();

        return response()->json([
            'message' => 'Cliente removido permanentemente.'
        ]);
    }

}
