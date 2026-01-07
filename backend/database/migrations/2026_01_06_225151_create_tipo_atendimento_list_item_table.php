<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tipo_atendimento_list_item', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tipo_atendimento_id')->constrained('tipos_atendimento')->onDelete('cascade');
            $table->foreignId('list_item_id')->constrained('list_items')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['tipo_atendimento_id', 'list_item_id'], 'tipo_item_unique');

            $table->index('tipo_atendimento_id');
            $table->index('list_item_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tipo_atendimento_list_item');
    }
};
