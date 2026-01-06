<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', User::class);

        return response()->json(
            User::select('id', 'name', 'email', 'role', 'created_at')
                ->orderBy('created_at', 'desc')
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

        // 🔐 Autorização correta
        $this->authorize('update', $targetUser);

        $authUser = Auth::user();

        // ✅ Validação base (todos podem alterar esses campos se autorizados)
        $rules = [
            'name'  => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $targetUser->id,
        ];

        // ✅ Somente MASTER pode alterar role
        if ($authUser->isMaster()) {
            $rules['role'] = 'sometimes|required|in:master,atendente';
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
}
