<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('field_sections', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // "Informações do Tratamento", "Lista de Medos"
            $table->string('slug')->unique(); // "informacoes-tratamento", "lista-medos"
            $table->integer('order')->default(0); // Ordem de exibição
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('field_sections');
    }
};
