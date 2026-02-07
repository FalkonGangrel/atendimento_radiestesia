<?php

namespace Database\Factories;

use App\Models\Permission;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PermissionFactory extends Factory
{
    protected $model = Permission::class;

    public function definition(): array
    {
        return [
            'key' => Str::slug($this->faker->unique()->words(2, true), '.'),
            'label' => $this->faker->sentence(3),
        ];
    }
}
