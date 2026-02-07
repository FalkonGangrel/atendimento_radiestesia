<?php

namespace Database\Factories;

use App\Models\TemplateAtendimento;
use Illuminate\Database\Eloquent\Factories\Factory;

class TemplateAtendimentoFactory extends Factory
{
    protected $model = TemplateAtendimento::class;

    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'cliente_id' => \App\Models\Cliente::factory(),
            'tipo_atendimento_id' => \App\Models\TipoAtendimento::factory(),
            'patient_name' => $this->faker->name(),
            'birth_date' => $this->faker->date(),
            'attendance_date' => $this->faker->date(),
            'treatment_focus' => $this->faker->sentence(),
            'observations' => $this->faker->paragraph(),
            'tables_needed' => $this->faker->numberBetween(1, 5),
            'lines_to_clean' => $this->faker->numberBetween(1, 10),
            'fractals_percent' => $this->faker->randomFloat(2, 0, 100),
            'treatment_duration_days' => $this->faker->numberBetween(1, 30),
            'has_directives' => $this->faker->boolean(),
            'has_ancestralidade' => $this->faker->boolean(),
            'has_rco' => $this->faker->boolean(),
            'status' => $this->faker->randomElement(['pending', 'completed', 'canceled']),
            'custom_data' => [
                'example_key' => $this->faker->word(),
            ],
            'valor_cobrado' => $this->faker->randomFloat(2, 10, 1000),
        ];
    }
}
