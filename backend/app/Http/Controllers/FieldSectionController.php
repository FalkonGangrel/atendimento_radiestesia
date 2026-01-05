<?php

namespace App\Http\Controllers;

use App\Models\FieldSection;
use App\Services\CustomFieldService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FieldSectionController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if (!$user || !$user->isMaster()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $sections = FieldSection::with(['fields' => function ($query) {
            $query->orderBy('order');
        }])->orderBy('order')->get();

        return response()->json($sections);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        if (!$user || !$user->isMaster()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:field_sections,slug',
            'order' => 'integer|min:0',
            'active' => 'boolean',
        ]);

        $section = CustomFieldService::createSection($validated);

        return response()->json($section, 201);
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();

        if (!$user || !$user->isMaster()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $section = FieldSection::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:field_sections,slug,' . $id,
            'order' => 'sometimes|integer|min:0',
            'active' => 'sometimes|boolean',
        ]);

        CustomFieldService::updateSection($id, $validated);

        return response()->json($section->fresh());
    }

    public function destroy($id)
    {
        $user = Auth::user();

        if (!$user || !$user->isMaster()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        CustomFieldService::deleteSection($id);

        return response()->json(['message' => 'Seção deletada com sucesso']);
    }
}
