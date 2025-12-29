<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('custom_fields', function (Blueprint $table) {
            $table->id();
            $table->foreignId('section_id')->constrained('field_sections')->onDelete('cascade');
            $table->string('name'); // "Duração do Tratamento", "Tem Diretivas"
            $table->string('slug')->unique(); // "duracao-tratamento", "tem-diretivas"
            $table->enum('type', ['text', 'number', 'checkbox', 'select', 'textarea', 'date'])->default('text');
            $table->json('options')->nullable(); // Para campos select: ["Opção 1", "Opção 2"]
            $table->integer('order')->default(0); // Ordem dentro da seção
            $table->boolean('is_required')->default(false);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('custom_fields');
    }
};
