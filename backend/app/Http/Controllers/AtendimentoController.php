<?php

namespace App\Http\Controllers;

use App\Services\AtendimentoService;
use Illuminate\Http\Request;

class AtendimentoController extends Controller
{
    public function index()
    {
        $userId = auth()->id();
        $atendimentos = AtendimentoService::getAll($userId);

        return response()->json($atendimentos);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_name' => 'required|string|max:255',
            'birth_date' => 'required|date',
            'attendance_date' => 'required|date',
            'treatment_focus' => 'nullable|string',
            'observations' => 'nullable|string',
            'tables_needed' => 'nullable|integer|min:0',
            'lines_to_clean' => 'nullable|integer|min:0',
            'fractals_percent' => 'nullable|numeric|min:0|max:100',
            'treatment_duration_days' => 'nullable|integer|min:0',
            'has_directives' => 'boolean',
            'has_ancestralidade' => 'boolean',
            'has_rco' => 'boolean',
            'items' => 'array',
            'items.*.list_item_id' => 'required|exists:list_items,id',
            'items.*.quantity' => 'nullable|integer|min:0',
        ]);

        $userId = auth()->id();

        $items = $validated['items'] ?? [];
        unset($validated['items']);

        $id = AtendimentoService::create($userId, $validated);

        if (!empty($items)) {
            AtendimentoService::saveItems($userId, $id, $items);
        }

        return response()->json(['id' => $id, 'message' => 'Atendimento criado com sucesso'], 201);
    }

    public function show($id)
    {
        $userId = auth()->id();
        $atendimento = AtendimentoService::find($userId, $id);

        if (!$atendimento) {
            return response()->json(['message' => 'Atendimento não encontrado'], 404);
        }

        $items = AtendimentoService::getItems($userId, $id);
        $atendimento->items = $items;

        return response()->json($atendimento);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'patient_name' => 'sometimes|required|string|max:255',
            'birth_date' => 'sometimes|required|date',
            'attendance_date' => 'sometimes|required|date',
            'treatment_focus' => 'nullable|string',
            'observations' => 'nullable|string',
            'tables_needed' => 'nullable|integer|min:0',
            'lines_to_clean' => 'nullable|integer|min:0',
            'fractals_percent' => 'nullable|numeric|min:0|max:100',
            'treatment_duration_days' => 'nullable|integer|min:0',
            'has_directives' => 'boolean',
            'has_ancestralidade' => 'boolean',
            'has_rco' => 'boolean',
            'status' => 'sometimes|in:em_andamento,concluido,cancelado',
            'items' => 'array',
            'items.*.list_item_id' => 'required|exists:list_items,id',
            'items.*.quantity' => 'nullable|integer|min:0',
        ]);

        $userId = auth()->id();

        $items = $validated['items'] ?? null;
        unset($validated['items']);

        $success = AtendimentoService::update($userId, $id, $validated);

        if (!$success) {
            return response()->json(['message' => 'Atendimento não encontrado'], 404);
        }

        if ($items !== null) {
            AtendimentoService::saveItems($userId, $id, $items);
        }

        return response()->json(['message' => 'Atendimento atualizado com sucesso']);
    }

    public function destroy($id)
    {
        $userId = auth()->id();
        $success = AtendimentoService::delete($userId, $id);

        if (!$success) {
            return response()->json(['message' => 'Atendimento não encontrado'], 404);
        }

        return response()->json(['message' => 'Atendimento deletado com sucesso']);
    }
}