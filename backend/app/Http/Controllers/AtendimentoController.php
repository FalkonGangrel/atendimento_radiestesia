<?php

namespace App\Http\Controllers;

use App\Models\Atendimento;
use App\Models\TipoAtendimento;
use App\Models\ListModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AtendimentoController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        $atendimentos = Atendimento::where('user_id', $userId)
            ->with('cliente')
            ->orderBy('attendance_date', 'desc')
            ->get();

        return response()->json($atendimentos);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        // Validar tipo de atendimento
        if ($request->has('tipo_atendimento_id')) {
            $tipo = TipoAtendimento::findOrFail($request->tipo_atendimento_id);

            // Verificar permissão usando Policy
            if (!$user->can('create', $tipo)) {
                return response()->json([
                    'message' => 'Você não tem permissão para criar atendimentos deste tipo'
                ], 403);
            }
        }
    
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
        ]);

        $validated['user_id'] = Auth::id();

        $atendimento = Atendimento::create($validated);
        $atendimento->load('cliente');

        return response()->json($atendimento, 201);
    }

    public function show($id)
    {
        $userId = Auth::id();

        $atendimento = Atendimento::where('id', $id)
            ->where('user_id', $userId)
            ->with(['cliente', 'items.listItem'])
            ->firstOrFail();

        return response()->json($atendimento);
    }

    public function update(Request $request, $id)
    {
        $userId = Auth::id();

        $atendimento = Atendimento::where('id', $id)
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
            'custom_data' => 'nullable|array',
        ]);

        $atendimento->update($validated);
        $atendimento->load('cliente');

        return response()->json($atendimento);
    }

    public function destroy($id)
    {
        $userId = Auth::id();

        $atendimento = Atendimento::where('id', $id)
            ->where('user_id', $userId)
            ->firstOrFail();

        $atendimento->delete();

        return response()->json(['message' => 'Atendimento deletado com sucesso']);
    }

    public function stats()
    {
        $userId = Auth::id();

        $total = Atendimento::where('user_id', $userId)->count();
        $esteMes = Atendimento::where('user_id', $userId)
            ->whereMonth('attendance_date', now()->month)
            ->whereYear('attendance_date', now()->year)
            ->count();

        return response()->json([
            'total' => $total,
            'este_mes' => $esteMes,
        ]);
    }
}
