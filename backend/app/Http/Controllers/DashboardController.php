<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class DashboardController extends Controller
{
    public function stats()
    {
        Gate::authorize('view-dashboard');

        $atendentes = User::where('role', 'atendente')->get();

        $stats = [];

        foreach ($atendentes as $atendente) {
            $tableName = "{$atendente->id}_atendimento";

            if (DB::getSchemaBuilder()->hasTable($tableName)) {
                $count = DB::table($tableName)->count();
                $concluidos = DB::table($tableName)->where('status', 'concluido')->count();
                $emAndamento = DB::table($tableName)->where('status', 'em_andamento')->count();

                $stats[] = [
                    'atendente_id' => $atendente->id,
                    'atendente_name' => $atendente->name,
                    'total_atendimentos' => $count,
                    'concluidos' => $concluidos,
                    'em_andamento' => $emAndamento,
                ];
            } else {
                $stats[] = [
                    'atendente_id' => $atendente->id,
                    'atendente_name' => $atendente->name,
                    'total_atendimentos' => 0,
                    'concluidos' => 0,
                    'em_andamento' => 0,
                ];
            }
        }

        return response()->json($stats);
    }
}