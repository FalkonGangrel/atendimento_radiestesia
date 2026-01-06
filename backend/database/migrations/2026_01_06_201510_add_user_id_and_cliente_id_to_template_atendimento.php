<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('template_atendimento', function (Blueprint $table) {
            // Adicionar user_id (atendente que criou o atendimento)
            $table->foreignId('user_id')->after('id')->constrained('users')->onDelete('cascade');

            // Adicionar cliente_id (cliente vinculado ao atendimento)
            $table->foreignId('cliente_id')->nullable()->after('user_id')->constrained('clientes')->onDelete('set null');

            // Adicionar índices
            $table->index('user_id');
            $table->index('cliente_id');
        });
    }

    public function down(): void
    {
        Schema::table('template_atendimento', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['cliente_id']);
            $table->dropColumn(['user_id', 'cliente_id']);
        });
    }
};
