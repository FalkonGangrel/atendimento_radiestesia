<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('template_atendimento', function (Blueprint $table) {
            $table->id();

            // Anamnese
            $table->string('patient_name');
            $table->date('birth_date');
            $table->date('attendance_date');
            $table->text('treatment_focus')->nullable();
            $table->text('observations')->nullable();

            // Campos calculados/informados
            $table->integer('tables_needed')->nullable();
            $table->integer('lines_to_clean')->nullable();
            $table->decimal('fractals_percent', 5, 2)->nullable();
            $table->integer('treatment_duration_days')->nullable();

            // Flags de tratamentos especiais
            $table->boolean('has_directives')->default(false);
            $table->boolean('has_ancestralidade')->default(false);
            $table->boolean('has_rco')->default(false);

            // Status
            $table->enum('status', ['em_andamento', 'concluido', 'cancelado'])->default('em_andamento');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('template_atendimento');
    }
};