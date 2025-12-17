<?php

namespace App\Http\Controllers;

use App\Models\ListItem;
use Illuminate\Http\Request;

class ListItemController extends Controller
{
    public function store(Request $request)
    {
        if (!auth()->user()->isMaster()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'list_id' => 'required|exists:lists,id',
            'name' => 'required|string|max:255',
            'has_quantity' => 'boolean',
            'order' => 'integer',
        ]);

        $item = ListItem::create($validated);

        return response()->json($item, 201);
    }

    public function update(Request $request, $id)
    {
        if (!auth()->user()->isMaster()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $item = ListItem::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'has_quantity' => 'sometimes|boolean',
            'active' => 'sometimes|boolean',
            'order' => 'sometimes|integer',
        ]);

        $item->update($validated);

        return response()->json($item);
    }

    public function destroy($id)
    {
        if (!auth()->user()->isMaster()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $item = ListItem::findOrFail($id);
        $item->delete();

        return response()->json(['message' => 'Item deletado com sucesso']);
    }
}