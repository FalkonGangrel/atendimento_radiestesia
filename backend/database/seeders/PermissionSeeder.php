<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [

            // CLIENTES
            ['key' => 'clientes.view',   'label' => 'Visualizar clientes'],
            ['key' => 'clientes.create', 'label' => 'Criar clientes'],
            ['key' => 'clientes.update', 'label' => 'Editar clientes'],
            ['key' => 'clientes.delete', 'label' => 'Excluir clientes'],

            // USUÁRIOS
            ['key' => 'usuarios.view',   'label' => 'Visualizar usuários'],
            ['key' => 'usuarios.create', 'label' => 'Criar usuários'],
            ['key' => 'usuarios.update', 'label' => 'Editar usuários'],
            ['key' => 'usuarios.delete', 'label' => 'Excluir usuários'],
            ['key' => 'usuarios.restore','label' => 'Restaurar usuários'],

            // TIPOS DE ATENDIMENTO
            ['key' => 'tipos.view',   'label' => 'Visualizar tipos de atendimento'],
            ['key' => 'tipos.manage', 'label' => 'Gerenciar tipos de atendimento'],

            // LISTAS
            ['key' => 'listas.view',   'label' => 'Visualizar listas'],
            ['key' => 'listas.manage', 'label' => 'Gerenciar listas'],

            // DASHBOARD
            ['key' => 'dashboard.master', 'label' => 'Acessar dashboard master'],
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(
                ['key' => $permission['key']],
                ['label' => $permission['label']]
            );
        }
    }
}
