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
            User::withTrashed()
                ->select('id', 'name', 'email', 'role', 'created_at', 'deleted_at')
                ->latest()
                ->get()
        );
    }

    public function show(User $user)
    {
        $this->authorize('view', $user);

        return response()->json(
            $user->only('id', 'name', 'email', 'role', 'created_at')
        );
    }

    public function update(Request $request, User $user)
    {
        $this->authorize('update', $user);

        $rules = [
            'name'  => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
        ];

        if ($request->has('role')) {
            $this->authorize('updateRole', $user);
            $rules['role'] = 'required|in:master,admin,atendente';
        }

        $user->update($request->validate($rules));

        return response()->json(
            $user->only('id', 'name', 'email', 'role')
        );
    }

    public function destroy(User $user)
    {
        $this->authorize('delete', $user);

        if ($user->id === Auth::id()) {
            return response()->json(
                ['message' => 'Você não pode deletar a si mesmo'],
                403
            );
        }

        $user->delete();

        return response()->json(['message' => 'Usuário deletado com sucesso']);
    }

    public function restore($id)
    {
        $user = User::withTrashed()->findOrFail($id);

        $this->authorize('restore', $user);

        $user->restore();

        return response()->json([
            'message' => 'Usuário restaurado com sucesso',
            'user' => $user->only('id', 'name', 'email', 'role')
        ]);
    }
}
