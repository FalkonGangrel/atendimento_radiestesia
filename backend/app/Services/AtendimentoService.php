<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AtendimentoService
{
    public static function getTableName(int $userId): string
    {
        return "{$userId}_atendimento";
    }

    public static function ensureTableExists(int $userId): void
    {
        $tableName = self::getTableName($userId);

        if (!Schema::hasTable($tableName)) {
            DB::statement("CREATE TABLE {$tableName} LIKE template_atendimento");
        }
    }

    public static function getAll(int $userId): array
    {
        self::ensureTableExists($userId);
        $tableName = self::getTableName($userId);

        return DB::table($tableName)
            ->orderByDesc('created_at')
            ->get()
            ->toArray();
    }

    public static function create(int $userId, array $data): int
    {
        self::ensureTableExists($userId);
        $tableName = self::getTableName($userId);

        $data['created_at'] = now();
        $data['updated_at'] = now();

        return DB::table($tableName)->insertGetId($data);
    }

    public static function find(int $userId, int $id): ?object
    {
        self::ensureTableExists($userId);
        $tableName = self::getTableName($userId);

        return DB::table($tableName)->where('id', $id)->first();
    }

    public static function update(int $userId, int $id, array $data): bool
    {
        self::ensureTableExists($userId);
        $tableName = self::getTableName($userId);

        $data['updated_at'] = now();

        return DB::table($tableName)->where('id', $id)->update($data) > 0;
    }

    public static function delete(int $userId, int $id): bool
    {
        self::ensureTableExists($userId);
        $tableName = self::getTableName($userId);

        // Deletar itens relacionados
        DB::table('atendimento_items')
            ->where('user_id', $userId)
            ->where('atendimento_table', $tableName)
            ->where('atendimento_id', $id)
            ->delete();

        return DB::table($tableName)->where('id', $id)->delete() > 0;
    }

    public static function getItems(int $userId, int $atendimentoId): array
    {
        $tableName = self::getTableName($userId);

        return DB::table('atendimento_items')
            ->join('list_items', 'atendimento_items.list_item_id', '=', 'list_items.id')
            ->join('lists', 'list_items.list_id', '=', 'lists.id')
            ->where('atendimento_items.user_id', $userId)
            ->where('atendimento_items.atendimento_table', $tableName)
            ->where('atendimento_items.atendimento_id', $atendimentoId)
            ->select(
                'atendimento_items.*',
                'list_items.name as item_name',
                'list_items.has_quantity',
                'lists.name as list_name',
                'lists.slug as list_slug'
            )
            ->get()
            ->toArray();
    }

    public static function saveItems(int $userId, int $atendimentoId, array $items): void
    {
        $tableName = self::getTableName($userId);

        // Deletar itens existentes
        DB::table('atendimento_items')
            ->where('user_id', $userId)
            ->where('atendimento_table', $tableName)
            ->where('atendimento_id', $atendimentoId)
            ->delete();

        // Inserir novos itens
        foreach ($items as $item) {
            DB::table('atendimento_items')->insert([
                'user_id' => $userId,
                'atendimento_table' => $tableName,
                'atendimento_id' => $atendimentoId,
                'list_item_id' => $item['list_item_id'],
                'quantity' => $item['quantity'] ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}