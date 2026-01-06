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
        return response()->json(
            ListModel::with('items')->where('active', true)->get()
        );
    }

    public function store(Request $request)
    {
        $this->authorize('create', ListModel::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $list = ListModel::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'created_by' => Auth::id(),
        ]);

        return response()->json($list, 201);
    }

    public function update(Request $request, $id)
    {

        $list = ListModel::findOrFail($id);
        
        $this->authorize('update', $list);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
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

        $list->delete();

        return response()->json(['message' => 'Lista deletada com sucesso']);
    }
}