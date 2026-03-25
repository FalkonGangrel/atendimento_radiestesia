<?php

namespace App\Http\Controllers;

use App\Models\Atendimento;
use App\Models\Cliente;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function stats()
    {
        $user    = Auth::user();
        $userId  = $user->id;
        $mesAtual = Carbon::now()->startOfMonth();

        // Atendimentos do mês
        $atendimentosMes = Atendimento::where('user_id', $userId)
            ->whereMonth('data_atendimento', now()->month)
            ->whereYear('data_atendimento', now()->year);

        // Retornos concluídos no mês
        $retornosConcluidos = (clone $atendimentosMes)
            ->where('retorno_concluido', true)
            ->count();

        // Retornos previstos (data_retorno futura, não concluídos)
        $retornosPrevistos = Atendimento::where('user_id', $userId)
            ->whereNotNull('data_retorno')
            ->where('retorno_concluido', false)
            ->where('data_retorno', '>=', now()->toDateString())
            ->orderBy('data_retorno')
            ->with(['cliente:id,name', 'tipo:id,nome'])
            ->get()
            ->map(fn ($a) => [
                'id'               => $a->id,
                'cliente'          => $a->cliente?->name,
                'tipo'             => $a->tipo?->nome,
                'data_retorno'     => $a->data_retorno,
                'data_atendimento' => $a->data_atendimento,
            ]);

        // Saldo do mês: valor dos tipos × atendimentos realizados
        $saldoMes = Atendimento::where('user_id', $userId)
            ->whereMonth('data_atendimento', now()->month)
            ->whereYear('data_atendimento', now()->year)
            ->join('tipos_atendimento', 'atendimentos.tipo_atendimento_id', '=', 'tipos_atendimento.id')
            ->sum('tipos_atendimento.valor');

        return response()->json([
            'atendimentos_mes'    => (clone $atendimentosMes)->count(),
            'clientes_cadastrados' => Cliente::where('user_id', $userId)->whereNull('deleted_at')->count(),
            'saldo_mes'           => (float) $saldoMes,
            'retornos_concluidos' => $retornosConcluidos,
            'retornos_previstos'  => $retornosPrevistos,
        ]);
    }
}