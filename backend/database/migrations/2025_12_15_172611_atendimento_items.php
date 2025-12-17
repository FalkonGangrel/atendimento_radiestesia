<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('atendimento_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('atendimento_table'); // Ex: "5_atendimento"
            $table->unsignedBigInteger('atendimento_id');
            $table->foreignId('list_item_id')->constrained('list_items')->onDelete('cascade');
            $table->integer('quantity')->nullable(); // Só se has_quantity = true
            $table->timestamps();

            $table->index(['user_id', 'atendimento_table', 'atendimento_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('atendimento_items');
    }
};