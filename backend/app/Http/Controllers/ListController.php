<?php

namespace App\Http\Controllers;

use App\Models\ListModel;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ListController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(ListModel::class, 'list');
    }

    public function index()
    {
        return response()->json(
            ListModel::with('items')
                ->where('active', true)
                ->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $list = ListModel::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
            'created_by' => auth()->id(),
            'active' => true,
        ]);

        return response()->json($list, 201);
    }

    public function update(Request $request, ListModel $list)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'active' => 'sometimes|boolean',
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $list->update($validated);

        return response()->json($list);
    }

    public function destroy(ListModel $list)
    {
        $list->delete();

        return response()->json(['message' => 'Lista deletada com sucesso']);
    }
}