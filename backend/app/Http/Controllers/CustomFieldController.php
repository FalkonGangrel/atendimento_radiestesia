<?php

namespace App\Http\Controllers;

use App\Models\CustomField;
use App\Services\CustomFieldService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CustomFieldController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', CustomField::class);

        $fields = CustomField::with('section')
            ->orderBy('order')
            ->get();

        return response()->json($fields);
    }

    public function store(Request $request)
    {
        $this->authorize('create', CustomField::class);

        $validated = $request->validate([
            'section_id' => 'required|exists:field_sections,id',
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:custom_fields,slug',
            'type' => 'required|in:text,number,checkbox,select,textarea,date',
            'options' => 'nullable|array',
            'order' => 'integer|min:0',
            'is_required' => 'boolean',
            'active' => 'boolean',
        ]);

        $field = CustomFieldService::createField($validated);

        return response()->json($field, 201);
    }

    public function update(Request $request, $id)
    {
        $field = CustomField::findOrFail($id);

        $this->authorize('update', $field);

        $validated = $request->validate([
            'section_id' => 'sometimes|required|exists:field_sections,id',
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:custom_fields,slug,' . $id,
            'type' => 'sometimes|required|in:text,number,checkbox,select,textarea,date',
            'options' => 'nullable|array',
            'order' => 'sometimes|integer|min:0',
            'is_required' => 'sometimes|boolean',
            'active' => 'sometimes|boolean',
        ]);

        CustomFieldService::updateField($id, $validated);

        return response()->json($field->fresh());
    }

    public function destroy($id)
    {
        $field = CustomField::findOrFail($id);

        $this->authorize('delete', $field);

        CustomFieldService::deleteField($id);

        return response()->json(['message' => 'Campo deletado com sucesso']);
    }
}
