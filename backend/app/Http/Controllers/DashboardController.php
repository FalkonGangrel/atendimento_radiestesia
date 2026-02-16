<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\TemplateAtendimento;

class DashboardController extends Controller
{
    public function stats()
    {
        $this->authorize('view-own-dashboard');

        $atendentes = User::where('role', 'atendente')->get();

        $stats = $atendentes->map(function ($atendente) {

            $query = TemplateAtendimento::where('user_id', $atendente->id);

            return [
                'atendente_id' => $atendente->id,
                'atendente_name' => $atendente->name,
                'total_atendimentos' => $query->count(),
                'concluidos' => (clone $query)->where('status', 'concluido')->count(),
                'em_andamento' => (clone $query)->where('status', 'em_andamento')->count(),
            ];
        });

        return response()->json($stats);
    }
}
