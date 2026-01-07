<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate; // Importar Gate
use App\Models\User;
use App\Models\ListModel; // Importar ListModel
use App\Models\ListItem; // Importar ListItem
use App\Models\TemplateAtendimento; // Importar TemplateAtendimento

class MasterController extends Controller
{
    public function stats(Request $request)
    {
        // 1. Autorização: Apenas Masters podem acessar este dashboard
        Gate::authorize('view-dashboard');

        try {
            // 2. Contar usuários
            $totalUsers = User::count();

            // 3. Contar listas (assumindo que a tabela 'lists' existe após as migrations)
            $totalLists = ListModel::count();

            // 4. Contar itens de listas (assumindo que a tabela 'list_items' existe após as migrations)
            $totalListItems = ListItem::count();

            // 5. Contar atendimentos de TODOS os usuários (da tabela única 'template_atendimento')
            $totalAtendimentos = TemplateAtendimento::count();

            return response()->json([
                'total_users' => $totalUsers,
                'total_atendimentos' => $totalAtendimentos,
                'total_lists' => $totalLists,
                'total_list_items' => $totalListItems,
            ]);
        } catch (\Exception $e) {
            // Retornar erro detalhado para debug em ambiente de desenvolvimento
            // Em produção, considere um erro mais genérico ou logar o erro
            return response()->json([
                'message' => 'Erro ao buscar estatísticas do Master',
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ], 500);
        }
    }
}
