<?php

namespace App\Services;

use App\Models\FieldSection;
use App\Models\CustomField;
use App\Models\UserFieldPermission;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class CustomFieldService
{
    public static function createSection(array $data): FieldSection
    {
        return FieldSection::create($data);
    }

    public static function updateSection(int $sectionId, array $data): bool
    {
        return FieldSection::findOrFail($sectionId)->update($data);
    }

    public static function deleteSection(int $sectionId): bool
    {
        $section = FieldSection::findOrFail($sectionId);
        return $section->delete();
    }

    public static function createField(array $data): CustomField
    {
        return CustomField::create($data);
    }

    public static function updateField(int $fieldId, array $data): bool
    {
        return CustomField::findOrFail($fieldId)->update($data);
    }

    public static function deleteField(int $fieldId): bool
    {
        $field = CustomField::findOrFail($fieldId);
        return $field->delete();
    }

    public static function getPermittedFieldsForUser(int $userId): Collection
    {
        $user = User::findOrFail($userId);

        if ($user->isMaster()) {
            return CustomField::where('active', true)
                ->with('section')
                ->orderBy('order')
                ->get();
        }

        return CustomField::whereHas('permissions', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })
            ->where('active', true)
            ->with('section')
            ->orderBy('order')
            ->get();
    }

    public static function getPermittedFieldsGroupedBySection(int $userId): array
    {
        $fields = self::getPermittedFieldsForUser($userId);

        $grouped = [];
        foreach ($fields as $field) {
            $sectionName = $field->section->name ?? 'Sem Seção';
            if (!isset($grouped[$sectionName])) {
                $grouped[$sectionName] = [];
            }
            $grouped[$sectionName][] = $field;
        }

        return $grouped;
    }

    public static function getUserPermissions(int $userId): Collection
    {
        return UserFieldPermission::where('user_id', $userId)
            ->with('customField.section')
            ->get();
    }

    public static function syncUserPermissions(int $userId, array $fieldIds): void
    {
        UserFieldPermission::where('user_id', $userId)->delete();

        foreach ($fieldIds as $fieldId) {
            self::grantPermission($userId, $fieldId);
        }
    }

    public static function grantPermission(int $userId, int $fieldId): UserFieldPermission
    {
        $existing = UserFieldPermission::where('user_id', $userId)
            ->where('custom_field_id', $fieldId)
            ->first();

        if ($existing) {
            return $existing;
        }

        return UserFieldPermission::create([
            'user_id' => $userId,
            'custom_field_id' => $fieldId,
        ]);
    }

    public static function revokePermission(int $userId, int $fieldId): bool
    {
        return UserFieldPermission::where('user_id', $userId)
            ->where('custom_field_id', $fieldId)
            ->delete() > 0;
    }
}
