<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tipos_atendimento', function (Blueprint $table) {
            $table->id();
            $table->string('nome'); // Ex: "Mesa radiônica de vidas passadas"
            $table->string('slug')->unique(); // Ex: "mesa-radionica-vidas-passadas"
            $table->text('descricao')->nullable(); // Descrição do tipo
            $table->decimal('valor', 10, 2); // Ex: 200.00
            $table->integer('duracao_minutos')->nullable(); // Duração estimada em minutos
            $table->boolean('ativo')->default(true);
            $table->integer('ordem')->default(0); // Para ordenação
            $table->timestamps();

            $table->index('slug');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tipos_atendimento');
    }
};
