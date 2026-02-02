<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            ['key' => 'clientes.view', 'label' => 'Visualizar clientes'],
            ['key' => 'clientes.create', 'label' => 'Criar clientes'],
            ['key' => 'clientes.update', 'label' => 'Editar clientes'],
            ['key' => 'clientes.delete', 'label' => 'Excluir clientes'],

            ['key' => 'usuarios.manage', 'label' => 'Gerenciar usuários'],

            ['key' => 'tipos_atendimento.manage', 'label' => 'Gerenciar tipos de atendimento'],
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['key' => $permission['key']],
                ['label' => $permission['label']]
            );
        }
    }
}
