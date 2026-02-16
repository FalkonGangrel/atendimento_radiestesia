<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\ListModel; // Importar ListModel
use App\Models\ListItem; // Importar ListItem
use App\Models\TemplateAtendimento; // Importar TemplateAtendimento

class AdminDashboardController extends Controller
{
    public function stats()
    {
        $this->authorize('view-admin-dashboard');

        return response()->json([
            'total_users' => User::count(),
            'total_atendimentos' => TemplateAtendimento::count(),
            'total_lists' => ListModel::count(),
            'total_list_items' => ListItem::count(),
        ]);
    }

}
