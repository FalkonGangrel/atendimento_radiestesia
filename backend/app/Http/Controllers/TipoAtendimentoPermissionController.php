<?php

namespace App\Http\Controllers;

use App\Models\TipoAtendimento;
use App\Models\User;
use App\Models\CustomField;
use App\Models\ListModel;
use App\Models\ListItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TipoAtendimentoPermissionController extends Controller
{
    /**
     * Obter todas as permissões de um usuário para um tipo específico
     */
    public function getUserPermissions($userId, $tipoId)
    {
        $user = User::findOrFail($userId);
        $tipo = TipoAtendimento::findOrFail($tipoId);

        // Verificar se o usuário tem permissão para este tipo
        $hasPermission = $user->tiposAtendimentoPermitidos()->where('tipo_atendimento_id', $tipoId)->exists();

        // Campos vinculados ao tipo
        $fields = $tipo->customFields()->get();

        // Listas vinculadas ao tipo
        $lists = $tipo->lists()->with('items')->get();

        // Itens vinculados ao tipo
        $items = $tipo->listItems()->get();

        return response()->json([
            'has_permission' => $hasPermission,
            'fields' => $fields,
            'lists' => $lists,
            'items' => $items,
        ]);
    }

    /**
     * Sincronizar permissões de um usuário para um tipo
     */
    public function syncPermissions(Request $request, $userId, $tipoId)
    {
        $request->validate([
            'has_permission' => 'required|boolean',
            'field_ids' => 'array',
            'field_ids.*' => 'exists:custom_fields,id',
            'list_ids' => 'array',
            'list_ids.*' => 'exists:lists,id',
            'item_ids' => 'array',
            'item_ids.*' => 'exists:list_items,id',
        ]);

        $user = User::findOrFail($userId);
        $tipo = TipoAtendimento::findOrFail($tipoId);

        DB::transaction(function () use ($user, $tipo, $request) {
            // 1. Sincronizar permissão do tipo
            if ($request->has_permission) {
                $user->tiposAtendimentoPermitidos()->syncWithoutDetaching([$tipo->id]);
            } else {
                $user->tiposAtendimentoPermitidos()->detach($tipo->id);
            }

            // 2. Sincronizar campos
            if ($request->has('field_ids')) {
                $tipo->customFields()->sync($request->field_ids);
            }

            // 3. Sincronizar listas
            if ($request->has('list_ids')) {
                $tipo->lists()->sync($request->list_ids);
            }

            // 4. Sincronizar itens
            if ($request->has('item_ids')) {
                $tipo->listItems()->sync($request->item_ids);
            }
        });

        return response()->json(['message' => 'Permissões atualizadas com sucesso']);
    }

    /**
     * Obter tipos, campos, listas e itens permitidos para o usuário autenticado
     */
    public function getMyPermissions(Request $request)
    {
        $user = $request->user();

        if ($user->isMaster()) {
            // Master vê tudo
            return response()->json([
                'tipos' => TipoAtendimento::where('ativo', true)->get(),
                'fields' => CustomField::with('section')->get(),
                'lists' => ListModel::with('items')->get(),
            ]);
        }

        // Atendente vê apenas o que tem permissão
        $tipos = $user->tiposAtendimentoPermitidos()->where('ativo', true)->get();

        // Campos permitidos (vinculados aos tipos permitidos)
        $fieldIds = DB::table('tipo_atendimento_custom_field')
            ->whereIn('tipo_atendimento_id', $tipos->pluck('id'))
            ->pluck('custom_field_id')
            ->unique();

        $fields = CustomField::with('section')->whereIn('id', $fieldIds)->get();

        // Listas permitidas (vinculadas aos tipos permitidos)
        $listIds = DB::table('tipo_atendimento_list')
            ->whereIn('tipo_atendimento_id', $tipos->pluck('id'))
            ->pluck('list_id')
            ->unique();

        $lists = ListModel::with('items')->whereIn('id', $listIds)->get();

        return response()->json([
            'tipos' => $tipos,
            'fields' => $fields,
            'lists' => $lists,
        ]);
    }
}
