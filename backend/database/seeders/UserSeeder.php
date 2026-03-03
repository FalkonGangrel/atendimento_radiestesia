<?php

namespace Database\Seeders;

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
            'name' => 'Helga Takeno',
            'email' => 'otarotparavida@gmail.com',
            'password' => Hash::make('De422309$'), // Senha específica para Helga
            'role' => 'master',
        ]);

        User::create([
            'name' => 'Atendente 2',
            'email' => 'atendente2@radiestesia.com',
            'password' => $defaultPassword,
            'role' => 'atendente',
        ]);
    }
}
