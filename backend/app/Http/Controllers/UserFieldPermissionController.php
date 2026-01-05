<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\CustomFieldService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class UserFieldPermissionController extends Controller
{
    public function getUserPermissions($userId)
    {
        $target = User::findOrFail($userId);
        Gate::authorize('manage-user-field-permissions', $target);

        return response()->json(
            CustomFieldService::getUserPermissions($userId)
        );
    }

    public function syncUserPermissions(Request $request, $userId)
    {

        $targetUser = User::findOrFail($userId);
        Gate::authorize('manage-user-field-permissions', $targetUser);

        if ($targetUser->isMaster() && $targetUser->id !== (int)$userId) {
            return response()->json(['message' => 'Não pode alterar permissões de outro master'], 403);
        }

        $validated = $request->validate([
            'field_ids' => 'required|array',
            'field_ids.*' => 'exists:custom_fields,id',
        ]);

        CustomFieldService::syncUserPermissions($userId, $validated['field_ids']);

        return response()->json([
            'message' => 'Permissões atualizadas com sucesso',
            'permissions' => CustomFieldService::getUserPermissions($userId),
        ]);
    }

    public function grantPermission(Request $request, $userId)
    {
        Gate::authorize('manage-user-field-permissions', User::findOrFail($userId));

        $validated = $request->validate([
            'field_id' => 'required|exists:custom_fields,id',
        ]);

        CustomFieldService::grantPermission($userId, $validated['field_id']);

        return response()->json(['message' => 'Permissão concedida com sucesso']);
    }

    public function revokePermission($userId, $fieldId)
    {
        Gate::authorize('manage-user-field-permissions', User::findOrFail($userId));

        CustomFieldService::revokePermission($userId, $fieldId);

        return response()->json(['message' => 'Permissão revogada com sucesso']);
    }
}
