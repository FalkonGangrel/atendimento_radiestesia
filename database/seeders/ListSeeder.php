<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ListModel;
use App\Models\User;

class ListSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $master = User::where('role', 'master')->first();

        ListModel::create([
            'name' => 'Aspectos',
            'slug' => 'aspectos',
            'created_by' => $master->id,
        ]);

        ListModel::create([
            'name' => 'Diretivas de Tratamento',
            'slug' => 'diretivas',
            'created_by' => $master->id,
        ]);
    }
}
