<?php

namespace Database\Factories;

use App\Models\TipoAtendimento;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class TipoAtendimentoFactory extends Factory
{
    protected $model = TipoAtendimento::class;

    public function definition(): array
    {
        $nome = $this->faker->unique()->words(2, true);
        return [
            'nome' => $nome,
            'slug' => Str::slug($nome),
            'descricao' => $this->faker->sentence(),
            'valor' => $this->faker->randomFloat(2, 50, 500),
            'duracao_minutos' => $this->faker->numberBetween(30, 120),
            'ativo' => true,
            'ordem' => $this->faker->numberBetween(1, 100),
        ];
    }
}
