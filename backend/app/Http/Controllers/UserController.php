<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', User::class);

        $users = User::select('id', 'name', 'email', 'role', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($users);
    }

    public function show($id)
    {
        $targetUser = User::findOrFail($id);

        $this->authorize('view', $targetUser);

        return response()->json($targetUser->only('id', 'name', 'email', 'role', 'created_at'));
    }

    public function update(Request $request, $id)
    {
        $targetUser = User::findOrFail($id);

        $this->authorize('update', $targetUser);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $id,
            'role' => $targetUser->isMaster() ? 'sometimes|in:master,atendente' : 'prohibited',
        ]);

        $targetUser->update($validated);

        return response()->json($targetUser->only('id', 'name', 'email', 'role'));
    }

    public function destroy($id)
    {
        $target = User::findOrFail($id);
        $this->authorize('delete', $target);

        if ($target->id === (int)$id) {
            return response()->json(['message' => 'Você não pode deletar a si mesmo'], 403);
        }

        $targetUser = User::findOrFail($id);
        $targetUser->delete();

        return response()->json(['message' => 'Usuário deletado com sucesso']);
    }
}
