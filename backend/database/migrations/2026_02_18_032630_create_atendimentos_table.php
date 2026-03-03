<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('atendimentos', function (Blueprint $table) {
            $table->id();

            $table->foreignId('cliente_id')
                ->constrained('clientes')
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('tipo_atendimento_id')
                ->nullable()
                ->constrained('tipos_atendimento')
                ->nullOnDelete();

            $table->date('data_atendimento');
            $table->date('data_retorno')->nullable();

            $table->text('observacao')->nullable();

            $table->timestamps();

            $table->index(['cliente_id', 'user_id']);
            $table->boolean('retorno_concluido')->default(false);
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('atendimentos');
    }
};
