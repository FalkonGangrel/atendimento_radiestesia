<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('list_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('list_id')->constrained('lists')->onDelete('cascade');
            $table->string('name'); // "Obsessores", "Contratos de Venda de Alma"
            $table->boolean('has_quantity')->default(false); // Se tem #
            $table->boolean('active')->default(true);
            $table->integer('order')->default(0); // Para ordenação
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('list_items');
    }
};