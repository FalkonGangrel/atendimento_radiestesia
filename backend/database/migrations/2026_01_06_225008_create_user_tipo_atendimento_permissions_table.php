<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_tipo_atendimento_permissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('tipo_atendimento_id')->constrained('tipos_atendimento')->onDelete('cascade');
            $table->timestamps();

            // Garantir que um usuário não tenha permissão duplicada para o mesmo tipo
            $table->unique(['user_id', 'tipo_atendimento_id'], 'user_tipo_unique');

            $table->index('user_id');
            $table->index('tipo_atendimento_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_tipo_atendimento_permissions');
    }
};
