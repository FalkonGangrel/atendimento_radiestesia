<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Atendimento;
use App\Models\Cliente;
use App\Models\TipoAtendimento;
use Illuminate\Support\Carbon;

class AdminDashboardController extends Controller
{
    public function stats()
    {
        $this->authorize('viewAny', User::class);

        $mes = now()->month;
        $ano = now()->year;

        // Usuários por role
        $usuariosPorRole = User::whereNull('deleted_at')
            ->selectRaw('role, count(*) as total')
            ->groupBy('role')
            ->pluck('total', 'role');

        // Atendimentos por atendente no mês atual
        $atendimentosPorAtendente = User::whereNull('deleted_at')
            ->where('role', 'atendente')
            ->withCount(['atendimentos as atendimentos_mes' => fn ($q) =>
                $q->whereMonth('data_atendimento', $mes)
                  ->whereYear('data_atendimento', $ano)
            ])
            ->withCount(['atendimentos as atendimentos_total'])
            ->withCount(['clientes as total_clientes' => fn ($q) =>
                $q->whereNull('deleted_at')
            ])
            ->get()
            ->map(fn ($u) => [
                'id'                 => $u->id,
                'name'               => $u->name,
                'atendimentos_mes'   => $u->atendimentos_mes,
                'atendimentos_total' => $u->atendimentos_total,
                'total_clientes'     => $u->total_clientes,
            ]);

        // Totais gerais
        $totalAtendimentosMes = Atendimento::whereMonth('data_atendimento', $mes)
            ->whereYear('data_atendimento', $ano)
            ->count();

        $saldoMes = Atendimento::whereMonth('data_atendimento', $mes)
            ->whereYear('data_atendimento', $ano)
            ->join('tipos_atendimento', 'atendimentos.tipo_atendimento_id', '=', 'tipos_atendimento.id')
            ->sum('tipos_atendimento.valor');

        // Retornos pendentes globais
        $retornosPendentes = Atendimento::whereNotNull('data_retorno')
            ->where('retorno_concluido', false)
            ->where('data_retorno', '>=', now()->toDateString())
            ->count();

        // Atendimentos por tipo no mês
        $atendimentosPorTipo = TipoAtendimento::withCount(['atendimentos as atendimentos_mes' => fn ($q) =>
                $q->whereMonth('data_atendimento', $mes)
                  ->whereYear('data_atendimento', $ano)
            ])
            ->get()
            ->map(fn ($t) => [
                'id'               => $t->id,
                'nome'             => $t->nome,
                'atendimentos_mes' => $t->atendimentos_mes,
            ]);

        return response()->json([
            // Usuários
            'usuarios_por_role'           => $usuariosPorRole,
            'total_usuarios'              => User::whereNull('deleted_at')->count(),

            // Atendimentos
            'atendimentos_mes'            => $totalAtendimentosMes,
            'saldo_mes'                   => (float) $saldoMes,
            'retornos_pendentes'          => $retornosPendentes,

            // Por atendente
            'atendimentos_por_atendente'  => $atendimentosPorAtendente,

            // Por tipo
            'atendimentos_por_tipo'       => $atendimentosPorTipo,

            // Extensível — adicionar novos indicadores aqui sem quebrar o frontend
            'extras'                      => [],
        ]);
    }
}