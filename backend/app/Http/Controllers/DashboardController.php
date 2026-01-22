<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\TemplateAtendimento;
use Illuminate\Support\Facades\Gate;

class DashboardController extends Controller
{
    public function stats()
    {
        // Garante que apenas usuários com a permissão 'view-dashboard' (Master) podem acessar
        Gate::authorize('view-dashboard');

        // Obtém todos os usuários com a role 'atendente'
        $atendentes = User::where('role', 'atendente')->get();

        $stats = [];

        foreach ($atendentes as $atendente) {
            // Consulta a tabela 'template_atendimento' e filtra pelo user_id do atendente
            // Não há necessidade de verificar tabelas dinâmicas
            $totalAtendimentos = TemplateAtendimento::where('user_id', $atendente->id)->count();
            $concluidos = TemplateAtendimento::where('user_id', $atendente->id)->where('status', 'concluido')->count();
            $emAndamento = TemplateAtendimento::where('user_id', $atendente->id)->where('status', 'em_andamento')->count();

            $stats[] = [
                'atendente_id' => $atendente->id,
                'atendente_name' => $atendente->name,
                'total_atendimentos' => $totalAtendimentos,
                'concluidos' => $concluidos,
                'em_andamento' => $emAndamento,
            ];
        }

        return response()->json($stats);
    }
}
