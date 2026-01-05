<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\CustomFieldService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserFieldPermissionController extends Controller
{
    public function getUserPermissions($userId)
    {
        $user = Auth::user();

        if (!$user || (!$user->isMaster() && $user->id !== (int)$userId)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $permissions = CustomFieldService::getUserPermissions($userId);

        return response()->json($permissions);
    }

    public function syncUserPermissions(Request $request, $userId)
    {
        $user = Auth::user();

        if (!$user || !$user->isMaster()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $targetUser = User::findOrFail($userId);

        if ($targetUser->isMaster() && $user->id !== (int)$userId) {
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
        $user = Auth::user();

        if (!$user || !$user->isMaster()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'field_id' => 'required|exists:custom_fields,id',
        ]);

        CustomFieldService::grantPermission($userId, $validated['field_id']);

        return response()->json(['message' => 'Permissão concedida com sucesso']);
    }

    public function revokePermission($userId, $fieldId)
    {
        $user = Auth::user();

        if (!$user || !$user->isMaster()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        CustomFieldService::revokePermission($userId, $fieldId);

        return response()->json(['message' => 'Permissão revogada com sucesso']);
    }
}
