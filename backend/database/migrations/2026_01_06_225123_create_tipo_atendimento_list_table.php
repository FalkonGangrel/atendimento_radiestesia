<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tipo_atendimento_list', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tipo_atendimento_id')->constrained('tipos_atendimento')->onDelete('cascade');
            $table->foreignId('list_id')->constrained('lists')->onDelete('cascade');
            $table->integer('ordem')->default(0); // Ordem de exibição da lista neste tipo
            $table->timestamps();

            $table->unique(['tipo_atendimento_id', 'list_id'], 'tipo_list_unique');

            $table->index('tipo_atendimento_id');
            $table->index('list_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tipo_atendimento_list');
    }
};
