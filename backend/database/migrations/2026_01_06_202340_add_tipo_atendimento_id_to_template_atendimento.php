<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('template_atendimento', function (Blueprint $table) {
            $table->foreignId('tipo_atendimento_id')->nullable()->after('cliente_id')->constrained('tipos_atendimento')->onDelete('set null');
            $table->decimal('valor_cobrado', 10, 2)->nullable()->after('tipo_atendimento_id'); // Valor que foi cobrado
            $table->index('tipo_atendimento_id');
        });
    }

    public function down(): void
    {
        Schema::table('template_atendimento', function (Blueprint $table) {
            $table->dropForeign(['tipo_atendimento_id']);
            $table->dropColumn(['tipo_atendimento_id', 'valor_cobrado']);
        });
    }
};
