<?php

namespace App\Http\Controllers;

use App\Models\FieldSection;
use App\Services\CustomFieldService;
use Illuminate\Http\Request;

class FieldSectionController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(FieldSection::class, 'section');
    }

    public function index()
    {
        return response()->json(
            FieldSection::with(['fields' => fn ($q) => $q->orderBy('order')])
                ->orderBy('order')
                ->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:field_sections,slug',
            'order' => 'integer|min:0',
            'active' => 'boolean',
        ]);

        $section = CustomFieldService::createSection($validated);

        return response()->json($section, 201);
    }

    public function update(Request $request, FieldSection $section)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:field_sections,slug,' . $section->id,
            'order' => 'sometimes|integer|min:0',
            'active' => 'sometimes|boolean',
        ]);

        CustomFieldService::updateSection($section->id, $validated);

        return response()->json($section->fresh());
    }

    public function destroy(FieldSection $section)
    {
        CustomFieldService::deleteSection($section->id);

        return response()->json(['message' => 'Seção deletada com sucesso']);
    }
}