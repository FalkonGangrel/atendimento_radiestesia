<?php

namespace App\Http\Controllers;

use App\Models\TemplateAtendimento;
use App\Models\AtendimentoItem;
use App\Models\TipoAtendimento;
use App\Models\Cliente;
use Illuminate\Http\Request;

class TemplateAtendimentoController extends Controller
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

    public function store(Request $request)
    {
        $tipo = TipoAtendimento::where('id', $request->tipo_atendimento_id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $this->authorize('create', $tipo);

        $validated = $request->validate([
            'cliente_id' => 'nullable|exists:clientes,id',
            'patient_name' => 'required|string|max:255',
            'birth_date' => 'required|date',
            'attendance_date' => 'required|date',
            'custom_data' => 'nullable|array',
            'items' => 'nullable|array',
        ]);

        // 🔒 Proteção extra para cliente
        if (!empty($validated['cliente_id'])) {
            $cliente = Cliente::where('id', $validated['cliente_id'])
                ->where('user_id', $request->user()->id)
                ->where('tipo_atendimento_id', $tipo->id)
                ->firstOrFail();
        }

        $validated['user_id'] = $request->user()->id;
        $validated['tipo_atendimento_id'] = $tipo->id;

        $atendimento = TemplateAtendimento::create($validated);

        // 🔒 Validar itens contra o tipo
        if (is_array($request->items)) {

            $itensPermitidos = $tipo->listItems()
                ->pluck('list_items.id')
                ->toArray();

            foreach ($request->items as $item) {

                if (!in_array($item['list_item_id'], $itensPermitidos)) {
                    abort(403, 'Item não permitido para este tipo de atendimento');
                }

                AtendimentoItem::create([
                    'template_atendimento_id' => $atendimento->id,
                    'list_item_id' => $item['list_item_id'],
                    'quantity' => $item['quantity'] ?? null,
                ]);
            }
        }

        return $atendimento->load(['cliente', 'items.listItem']);
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
}