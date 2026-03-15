<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\Atendimento;
use App\Http\Resources\ClienteResource;
use App\Http\Resources\AtendimentoResource;
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
        $user  = auth()->user();
        $query = Cliente::withTrashed()  // master vê soft-deleted também
            ->ownedBy($user)
            ->with('atendente')
            ->with(['atendimentos' => function ($q) {
                $q->latest('data_atendimento')->limit(1);
            }]);

        // Filtro de status: active=true → apenas ativos, active=false → apenas inativos/deletados
        if ($request->has('active')) {
            if ($request->boolean('active')) {
                $query->whereNull('deleted_at');
            } else {
                $query->onlyTrashed();
            }
        }

        if ($search = $request->get('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        return ClienteResource::collection($query->latest()->paginate(20));
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
            'ativo'   => true,
        ]);

        return new ClienteResource($cliente->load('atendente:id,name,email'));
    }

    public function update(ClienteRequest $request, Cliente $cliente)
    {
        $cliente->update($request->validated());

        return new ClienteResource($cliente->load('atendente'));
    }

    public function destroy(Cliente $cliente)
    {
        $cliente->delete();

        return response()->json(['message' => 'Cliente desativado com sucesso.']);
    }

    public function restore($id)
    {
        $cliente = Cliente::withTrashed()
            ->ownedBy(auth()->user())
            ->findOrFail($id);

        $this->authorize('restore', $cliente);

        $cliente->restore();

        return new ClienteResource($cliente->load('atendente:id,name,email'));
    }

    public function forceDelete($id)
    {
        $cliente = Cliente::withTrashed()
            ->ownedBy(auth()->user())
            ->findOrFail($id);

        $this->authorize('forceDelete', $cliente);

        $cliente->forceDelete();

        return response()->json(['message' => 'Cliente removido permanentemente.']);
    }

    public function historico(Cliente $cliente)
    {
        $this->authorize('view', $cliente);

        $historico = Atendimento::where('cliente_id', $cliente->id)
            ->where('user_id', auth()->id())
            ->with('tipo')
            ->orderByDesc('data_atendimento')
            ->get();

        return AtendimentoResource::collection($historico);
    }
}