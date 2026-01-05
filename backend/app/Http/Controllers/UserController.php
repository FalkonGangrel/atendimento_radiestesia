<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if (!$user || !$user->isMaster()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $users = User::select('id', 'name', 'email', 'role', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($users);
    }

    public function show($id)
    {
        $user = Auth::user();
        $targetUser = User::findOrFail($id);

        if (!$user || (!$user->isMaster() && $user->id !== (int)$id)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($targetUser->only('id', 'name', 'email', 'role', 'created_at'));
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $targetUser = User::findOrFail($id);

        if (!$user || (!$user->isMaster() && $user->id !== (int)$id)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $id,
            'role' => $user->isMaster() ? 'sometimes|in:master,atendente' : 'prohibited',
        ]);

        $targetUser->update($validated);

        return response()->json($targetUser->only('id', 'name', 'email', 'role'));
    }

    public function destroy($id)
    {
        $user = Auth::user();

        if (!$user || !$user->isMaster()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($user->id === (int)$id) {
            return response()->json(['message' => 'Você não pode deletar a si mesmo'], 403);
        }

        $targetUser = User::findOrFail($id);
        $targetUser->delete();

        return response()->json(['message' => 'Usuário deletado com sucesso']);
    }
}
