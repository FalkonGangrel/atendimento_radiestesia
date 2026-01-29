<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Builder;

class UserController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', User::class);

        return response()->json(
            User::withTrashed()
                ->select('id', 'name', 'email', 'role', 'created_at', 'deleted_at')
                ->latest()
                ->get()
        );
    }

    public function show($id)
    {
        $user = User::findOrFail($id);

        $this->authorize('view', $user);

        return response()->json(
            $user->only('id', 'name', 'email', 'role', 'created_at')
        );
    }

    public function update(Request $request, $id)
    {
        $targetUser = User::findOrFail($id);

        $this->authorize('update', $targetUser);

        $rules = [
            'name'  => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $targetUser->id,
        ];

        // ROLE só se:
        // - veio no request
        // - policy permitir
        if ($request->has('role')) {
            $this->authorize('updateRole', $targetUser);

            $rules['role'] = 'required|in:master,atendente';
        }

        $validated = $request->validate($rules);

        $targetUser->update($validated);

        return response()->json(
            $targetUser->only('id', 'name', 'email', 'role')
        );
    }

    public function destroy($id)
    {
        $targetUser = User::findOrFail($id);

        $this->authorize('delete', $targetUser);

        if ($targetUser->id === Auth::id()) {
            return response()->json(
                ['message' => 'Você não pode deletar a si mesmo'],
                403
            );
        }

        $targetUser->delete();

        return response()->json([
            'message' => 'Usuário deletado com sucesso'
        ]);
    }

    public function restore($id)
    {
        $targetUser = User::withTrashed()->findOrFail($id);

        $this->authorize('restore', $targetUser);

        if (! $targetUser->trashed()) {
            return response()->json([
                'message' => 'Usuário não está deletado'
            ], 400);
        }

        $targetUser->restore();

        return response()->json([
            'message' => 'Usuário restaurado com sucesso',
            'user' => $targetUser->only('id', 'name', 'email', 'role')
        ]);
    }
}
