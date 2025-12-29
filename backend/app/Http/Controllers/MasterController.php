<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class MasterController extends Controller
{
    public function stats(Request $request)
    {
        try {
            // 1. Contar usuários (sempre funciona)
            $totalUsers = User::count();

            // 2. Contar listas (verificar se a tabela existe)
            $totalLists = 0;
            if (DB::getSchemaBuilder()->hasTable('lists')) {
                $totalLists = DB::table('lists')->count();
            }

            // 3. Contar itens de listas (verificar se a tabela existe)
            $totalListItems = 0;
            if (DB::getSchemaBuilder()->hasTable('list_items')) {
                $totalListItems = DB::table('list_items')->count();
            }

            // 4. Contar atendimentos de TODOS os usuários
            $totalAtendimentos = 0;

            $users = User::all();
            foreach ($users as $user) {
                $tableName = "{$user->id}_atendimento";

                // Verificar se a tabela existe
                if (DB::getSchemaBuilder()->hasTable($tableName)) {
                    try {
                        $count = DB::table($tableName)->count();
                        $totalAtendimentos += $count;
                    } catch (\Exception $e) {
                        // Se der erro ao contar, ignora essa tabela
                        continue;
                    }
                }
            }

            return response()->json([
                'total_users' => $totalUsers,
                'total_atendimentos' => $totalAtendimentos,
                'total_lists' => $totalLists,
                'total_list_items' => $totalListItems,
            ]);

        } catch (\Exception $e) {
            // Retornar erro detalhado para debug
            return response()->json([
                'message' => 'Erro ao buscar estatísticas',
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ], 500);
        }
    }
}
