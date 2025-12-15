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
            'email' => 'master@innerai.com',
            'password' => $defaultPassword,
            'role' => 'master',
        ]);

        User::create([
            'name' => 'Atendente Teste',
            'email' => 'atendente@innerai.com',
            'password' => $defaultPassword,
            'role' => 'atendente',
        ]);
    }
}
