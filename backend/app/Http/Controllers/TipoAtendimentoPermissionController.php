<?php

namespace App\Http\Controllers;

use App\Models\TipoAtendimento;
use App\Models\User;
use App\Models\CustomField;
use App\Models\ListModel;
use App\Models\ListItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class TipoAtendimentoPermissionController extends Controller
{
    /**
     * Obter todas as permissões de um usuário para um tipo específico.
     * Apenas Masters podem gerenciar permissões de outros usuários.
     */
    public function getUserPermissions($userId, $tipoId)
    {
        $targetUser = User::findOrFail($userId);
        $tipo = TipoAtendimento::findOrFail($tipoId);

        // Autorização: Apenas o Master pode gerenciar permissões de outros usuários.
        // O Gate 'manage-user-field-permissions' já foi definido no AuthServiceProvider.
        Gate::authorize('manage-user-field-permissions', Auth::user(), $targetUser);

        // Verificar se o usuário tem permissão para este tipo
        $hasPermission = $targetUser->tiposAtendimentoPermitidos()->where('tipo_atendimento_id', $tipoId)->exists();

        // Campos vinculados ao tipo (todos os campos que o Master pode vincular a este tipo)
        $fields = $tipo->customFields()->with('section')->get();

        // Listas vinculadas ao tipo (todas as listas que o Master pode vincular a este tipo)
        $lists = $tipo->lists()->with('items')->get();

        // Itens vinculados ao tipo (todos os itens que o Master pode vincular a este tipo)
        $items = $tipo->listItems()->get();

        return response()->json([
            'has_permission' => $hasPermission,
            'fields' => $fields,
            'lists' => $lists,
            'items' => $items,
        ]);
    }

    /**
     * Sincronizar permissões de um usuário para um tipo.
     * Apenas Masters podem gerenciar permissões de outros usuários.
     */
    public function syncPermissions(Request $request, $userId, $tipoId)
    {
        $targetUser = User::findOrFail($userId);
        $tipo = TipoAtendimento::findOrFail($tipoId);

        // Autorização: Apenas o Master pode gerenciar permissões de outros usuários.
        Gate::authorize('manage-user-field-permissions', Auth::user(), $targetUser);

        $request->validate([
            'has_permission' => 'required|boolean',
            'field_ids' => 'array',
            'field_ids.*' => 'exists:custom_fields,id',
            'list_ids' => 'array',
            'list_ids.*' => 'exists:lists,id', // Helga prefers ListModel
            'item_ids' => 'array',
            'item_ids.*' => 'exists:list_items,id',
        ]);

        DB::transaction(function () use ($targetUser, $tipo, $request) {
            // 1. Sincronizar permissão do tipo para o usuário
            if ($request->has_permission) {
                $targetUser->tiposAtendimentoPermitidos()->syncWithoutDetaching([$tipo->id]);
            } else {
                $targetUser->tiposAtendimentoPermitidos()->detach($tipo->id);
            }

            // 2. Sincronizar campos vinculados ao TIPO (não ao usuário diretamente)
            // Isso define quais campos ESTÃO DISPONÍVEIS para ESTE TIPO DE ATENDIMENTO
            if ($request->has('field_ids')) {
                $tipo->customFields()->sync($request->field_ids);
            } else {
                $tipo->customFields()->detach(); // Se não enviar, desvincula todos
            }

            // 3. Sincronizar listas vinculadas ao TIPO (não ao usuário diretamente)
            // Isso define quais listas ESTÃO DISPONÍVEIS para ESTE TIPO DE ATENDIMENTO
            if ($request->has('list_ids')) {
                $tipo->lists()->sync($request->list_ids);
            } else {
                $tipo->lists()->detach(); // Se não enviar, desvincula todas
            }

            // 4. Sincronizar itens vinculados ao TIPO (não ao usuário diretamente)
            // Isso define quais itens ESTÃO DISPONÍVEIS para ESTE TIPO DE ATENDIMENTO
            if ($request->has('item_ids')) {
                $tipo->listItems()->sync($request->item_ids);
            } else {
                $tipo->listItems()->detach(); // Se não enviar, desvincula todos
            }
        });

        return response()->json(['message' => 'Permissões atualizadas com sucesso']);
    }

    /**
     * Obter tipos, campos, listas e itens permitidos para o usuário autenticado.
     * Este é o endpoint que o frontend de um atendente usará para carregar suas opções.
     */
    public function getMyPermissions(Request $request)
    {
        $user = $request->user();

        if ($user->isMaster()) {
            // Master vê tudo
            $tipos = TipoAtendimento::where('ativo', true)->orderBy('ordem')->orderBy('nome')->get();
            $fields = CustomField::with('section')->orderBy('order')->get();
            $lists = ListModel::with('items')->orderBy('name')->get(); // Helga prefers ListModel

            return response()->json([
                'tipos' => $tipos,
                'fields' => $fields,
                'lists' => $lists,
            ]);
        }

        // Atendente vê apenas o que tem permissão
        $tiposPermitidos = $user->tiposAtendimentoPermitidos()
            ->where('ativo', true)
            ->orderBy('ordem')
            ->orderBy('nome')
            ->get();

        $tipoIds = $tiposPermitidos->pluck('id');

        // Campos permitidos (vinculados aos tipos permitidos)
        $fieldsPermitidos = CustomField::with('section')
            ->whereHas('tiposAtendimento', function ($query) use ($tipoIds) {
                $query->whereIn('tipo_atendimento_id', $tipoIds);
            })
            ->orderBy('order')
            ->get();

        // Listas permitidas (vinculadas aos tipos permitidos)
        $listsPermitidas = ListModel::with('items')
            ->whereHas('tiposAtendimento', function ($query) use ($tipoIds) {
                $query->whereIn('tipo_atendimento_id', $tipoIds);
            })
            ->orderBy('name')
            ->get();

        // Itens permitidos (vinculados aos tipos permitidos)
        $itemsPermitidos = ListItem::whereHas('tiposAtendimento', function ($query) use ($tipoIds) {
                $query->whereIn('tipo_atendimento_id', $tipoIds);
            })
            ->orderBy('name')
            ->get();

        return response()->json([
            'tipos' => $tiposPermitidos,
            'fields' => $fieldsPermitidos,
            'lists' => $listsPermitidas,
            'items' => $itemsPermitidos, // Incluindo itens para atendente
        ]);
    }
}
