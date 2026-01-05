<?php

namespace App\Http\Controllers;

use App\Models\FieldSection;
use App\Services\CustomFieldService;
use Illuminate\Http\Request;

class FieldSectionController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', FieldSection::class);

        $sections = FieldSection::with(['fields' => function ($query) {
            $query->orderBy('order');
        }])->orderBy('order')->get();

        return response()->json($sections);
    }

    public function store(Request $request)
    {
        $this->authorize('create', FieldSection::class);

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
        $section = FieldSection::findOrFail($id);

        $this->authorize('update', $section);

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
        $section = FieldSection::findOrFail($id);

        $this->authorize('delete', $section);

        CustomFieldService::deleteSection($id);

        return response()->json(['message' => 'Seção deletada com sucesso']);
    }
}
