<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TipoAtendimento;
use Illuminate\Support\Str;

class TipoAtendimentoSeeder extends Seeder
{
    public function run(): void
    {
        TipoAtendimento::create([
            'nome' => 'Tarot Padrão',
            'slug' => Str::slug('Tarot Padrão'),
            'descricao' => 'Atendimento Tarot Padrão.',
            'valor' => 0.00,
            'duracao_minutos' => 60,
            'ativo' => true,
            'ordem' => 1,
        ]);

        TipoAtendimento::create([
            'nome' => 'Tarot Simplificado',
            'slug' => Str::slug('Tarot Simplificado'),
            'descricao' => 'Atendimento Tarot Simplificado.',
            'valor' => 0.00,
            'duracao_minutos' => 60,
            'ativo' => true,
            'ordem' => 2,
        ]);

        TipoAtendimento::create([
            'nome' => 'Tarot Terapêutico',
            'slug' => Str::slug('Tarot Terapêutico'),
            'descricao' => 'Atendimento Tarot Terapêutico.',
            'valor' => 0.00,
            'duracao_minutos' => 60,
            'ativo' => true,
            'ordem' => 3,
        ]);

        TipoAtendimento::create([
            'nome' => 'Mesa Radiestesia Vidas Passadas',
            'slug' => Str::slug('Mesa Radiestesia Vidas Passadas'),
            'descricao' => 'Atendimento Mesa Radiônica Vidas Passadas.',
            'valor' => 0.00,
            'duracao_minutos' => 60,
            'ativo' => true,
            'ordem' => 4,
        ]);

        TipoAtendimento::create([
            'nome' => 'Mesa Radiestesia Ancestralidade',
            'slug' => Str::slug('Mesa Radiestesia Ancestralidade'),
            'descricao' => 'Atendimento Mesa Radiônica Ancestralidade.',
            'valor' => 0.00,
            'duracao_minutos' => 60,
            'ativo' => true,
            'ordem' => 5,
        ]);

    }
}
