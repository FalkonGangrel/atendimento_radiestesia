<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Senha padrão para todos os usuários de teste
        $defaultPassword = Hash::make('123!@#asdASD'); // Use uma senha segura!

        User::create([
            'name' => 'Master Admin',
            'email' => 'master@radiestesia.com',
            'password' => $defaultPassword,
            'role' => 'master',
        ]);

        User::create([
            'name' => 'Atendente Teste 1',
            'email' => 'atendente1@radiestesia.com',
            'password' => $defaultPassword,
            'role' => 'atendente',
        ]);

        User::create([
            'name' => 'Atendente Teste 2',
            'email' => 'atendente2@radiestesia.com',
            'password' => $defaultPassword,
            'role' => 'atendente',
        ]);
    }
}
