<?php

namespace App\Http\Controllers;

use App\Models\TemplateAtendimento;
use App\Models\AtendimentoItem;
use App\Models\TipoAtendimento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AtendimentoController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        $atendimentos = TemplateAtendimento::where('user_id', $userId)
            ->with(['cliente'])
            ->orderBy('attendance_date', 'desc')
            ->get();

        return response()->json($atendimentos);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        // =======================
        // VALIDAR TIPO
        // =======================
        $request->validate([
            'tipo_atendimento_id' => 'required|exists:tipos_atendimento,id',
        ]);

        $tipo = TipoAtendimento::findOrFail($request->tipo_atendimento_id);

        // POLICY: pode criar?
        if (!$user->can('create', $tipo)) {
            return response()->json([
                'message' => 'Você não tem permissão para criar atendimentos deste tipo'
            ], 403);
        }

        // ==============================
        // VALIDAR DADOS DO ATENDIMENTO
        // ==============================
        $validated = $request->validate([
            'cliente_id' => 'nullable|exists:clientes,id',
            'patient_name' => 'required|string|max:255',
            'birth_date' => 'required|date',
            'attendance_date' => 'required|date',
            'treatment_focus' => 'nullable|string',
            'observations' => 'nullable|string',
            'tables_needed' => 'nullable|integer',
            'lines_to_clean' => 'nullable|integer',
            'fractals_percent' => 'nullable|numeric',
            'treatment_duration_days' => 'nullable|integer',
            'has_directives' => 'boolean',
            'has_ancestralidade' => 'boolean',
            'has_rco' => 'boolean',
            'status' => 'nullable|in:em_andamento,concluido,cancelado',
            'custom_data' => 'nullable|array',
            'items' => 'nullable|array'
        ]);

        // Forçar user_id
        $validated['user_id'] = $user->id;

        // Tipo de atendimento
        $validated['tipo_atendimento_id'] = $request->tipo_atendimento_id;

        // ==============================
        // CRIAR ATENDIMENTO
        // ==============================
        $atendimento = TemplateAtendimento::create($validated);

        // ==============================
        // VALIDAR E CRIAR ITEMS
        // ==============================
        if ($request->has('items') && is_array($request->items)) {

            // Listas permitidas
            $listasPermitidas = $tipo->lists()->pluck('lists.id')->toArray();
            $itensPermitidos = $tipo->listItems()->pluck('list_items.id')->toArray();

            foreach ($request->items as $itemData) {

                // itemData deve ter: list_item_id, quantity (opcional)
                if (!isset($itemData['list_item_id'])) continue;

                $itemId = $itemData['list_item_id'];

                if (!in_array($itemId, $itensPermitidos)) {
                    return response()->json([
                        'message' => "Item {$itemId} não permitido para este tipo de atendimento"
                    ], 403);
                }

                // criar item
                AtendimentoItem::create([
                    'template_atendimento_id' => $atendimento->id,
                    'list_item_id' => $itemId,
                    'quantity' => $itemData['quantity'] ?? null
                ]);
            }
        }

        // Carregar tudo
        $atendimento->load(['cliente', 'items.listItem']);

        return response()->json($atendimento, 201);
    }

    public function show($id)
    {
        $userId = Auth::id();

        $atendimento = TemplateAtendimento::where('id', $id)
            ->where('user_id', $userId)
            ->with(['cliente', 'items.listItem'])
            ->firstOrFail();

        return response()->json($atendimento);
    }

    public function update(Request $request, $id)
    {
        $userId = Auth::id();

        $atendimento = TemplateAtendimento::where('id', $id)
            ->where('user_id', $userId)
            ->firstOrFail();

        $validated = $request->validate([
            'cliente_id' => 'nullable|exists:clientes,id',
            'patient_name' => 'sometimes|required|string|max:255',
            'birth_date' => 'sometimes|required|date',
            'attendance_date' => 'sometimes|required|date',
            'treatment_focus' => 'nullable|string',
            'observations' => 'nullable|string',
            'tables_needed' => 'nullable|integer',
            'lines_to_clean' => 'nullable|integer',
            'fractals_percent' => 'nullable|numeric',
            'treatment_duration_days' => 'nullable|integer',
            'has_directives' => 'boolean',
            'has_ancestralidade' => 'boolean',
            'has_rco' => 'boolean',
            'status' => 'nullable|in:em_andamento,concluido,cancelado',
            'custom_data' => 'nullable|array'
        ]);

        $atendimento->update($validated);

        $atendimento->load('cliente');

        return response()->json($atendimento);
    }

    public function destroy($id)
    {
        $userId = Auth::id();

        $atendimento = TemplateAtendimento::where('id', $id)
            ->where('user_id', $userId)
            ->firstOrFail();

        $atendimento->delete();

        return response()->json(['message' => 'Atendimento deletado com sucesso']);
    }

    public function stats()
    {
        $userId = Auth::id();

        $total = TemplateAtendimento::where('user_id', $userId)->count();

        $esteMes = TemplateAtendimento::where('user_id', $userId)
            ->whereMonth('attendance_date', now()->month)
            ->whereYear('attendance_date', now()->year)
            ->count();

        return response()->json([
            'total' => $total,
            'este_mes' => $esteMes,
        ]);
    }
}
