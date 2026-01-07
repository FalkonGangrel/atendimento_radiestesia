<?php

namespace App\Http\Controllers;

use App\Models\ListModel;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class ListController extends Controller
{
    public function index()
    {
        // Garante que apenas Masters (ou quem tiver viewAny na Policy) podem ver todas as listas
        $this->authorize('viewAny', ListModel::class);

        return response()->json(
            ListModel::with('items')->where('active', true)->get()
        );
    }

    public function store(Request $request)
    {
        $this->authorize('create', ListModel::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string', // Adicionar se existir na migration
        ]);

        $list = ListModel::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'description' => $validated['description'] ?? null, // Adicionar se existir na migration
            'created_by' => Auth::id(),
            'active' => true, // Definir como ativo por padrão
        ]);

        return response()->json($list, 201);
    }

    public function update(Request $request, $id)
    {
        $list = ListModel::findOrFail($id);
        $this->authorize('update', $list);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string', // Adicionar se existir na migration
            'active' => 'sometimes|boolean',
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $list->update($validated);

        return response()->json($list);
    }

    public function destroy($id)
    {
        $list = ListModel::findOrFail($id);
        $this->authorize('delete', $list);

        // Se você tiver soft deletes, use $list->delete();
        // Se for exclusão permanente, use $list->forceDelete();
        $list->delete();

        return response()->json(['message' => 'Lista deletada com sucesso']);
    }
}
