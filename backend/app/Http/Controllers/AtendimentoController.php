<?php

namespace App\Http\Controllers;

use App\Models\Atendimento;
use App\Models\TemplateAtendimento;
use App\Models\TipoAtendimento;
use App\Http\Requests\StoreAtendimentoRequest;
use App\Http\Resources\AtendimentoResource;
use Illuminate\Http\Request;

class AtendimentoController extends Controller
{
    public function index(Request $request)
    {
        $tipo = TipoAtendimento::where('id', $request->get('tipo_atendimento_id'))
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $this->authorize('viewAny', [TemplateAtendimento::class, $tipo]);

        return TemplateAtendimento::where('user_id', $request->user()->id)
            ->where('tipo_atendimento_id', $tipo->id)
            ->with('cliente')
            ->orderByDesc('attendance_date')
            ->get();
    }

    public function store(StoreAtendimentoRequest $request)
    {
        $data = $request->validated();

        $data['user_id'] = auth()->id();

        $atendimento = Atendimento::create($data);

        return new AtendimentoResource($atendimento);
    }

    public function show(TemplateAtendimento $atendimento)
    {
        $this->authorize('view', $atendimento);

        return $atendimento->load(['cliente', 'items.listItem']);
    }

    public function update(Request $request, TemplateAtendimento $atendimento)
    {
        $this->authorize('update', $atendimento);

        $validated = $request->validate([
            'patient_name' => 'sometimes|string|max:255',
            'attendance_date' => 'sometimes|date',
            'custom_data' => 'nullable|array',
        ]);

        $atendimento->update($validated);

        return $atendimento->load('cliente');
    }

    public function destroy(TemplateAtendimento $atendimento)
    {
        $this->authorize('delete', $atendimento);

        $atendimento->delete();

        return response()->json(['message' => 'Atendimento deletado']);
    }

    public function concluirRetorno(Atendimento $atendimento)
    {
        $atendimento->update([
            'retorno_concluido' => true,
        ]);

        return response()->noContent();
    }

    public function concluirEGerar(Atendimento $atendimento)
    {
        $atendimento->update([
            'retorno_concluido' => true,
        ]);

        Atendimento::create([
            'cliente_id' => $atendimento->cliente_id,
            'tipo_atendimento_id' => $atendimento->tipo_atendimento_id,
            'user_id' => auth()->id(),
            'data_atendimento' => now(),
            'observacao' => 'Retorno automático',
        ]);

        return response()->noContent();
    }
}