<?php

namespace App\Http\Controllers;

use App\Models\ListModel;
use App\Models\ListItem;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ListController extends Controller
{
    public function index()
    {
        $lists = ListModel::with('items')->where('active', true)->get();
        return response()->json($lists);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->isMaster()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $list = ListModel::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'created_by' => auth()->id(),
        ]);

        return response()->json($list, 201);
    }

    public function update(Request $request, $id)
    {
        if (!auth()->user()->isMaster()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $list = ListModel::findOrFail($id);

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
        if (!auth()->user()->isMaster()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $list = ListModel::findOrFail($id);
        $list->delete();

        return response()->json(['message' => 'Lista deletada com sucesso']);
    }
}