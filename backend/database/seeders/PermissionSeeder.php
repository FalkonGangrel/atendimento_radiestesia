<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [

            // USUÁRIOS
            ['key' => 'usuarios.view',   'label' => 'Visualizar usuários'],
            ['key' => 'usuarios.create', 'label' => 'Criar usuários'],
            ['key' => 'usuarios.update', 'label' => 'Editar usuários'],
            ['key' => 'usuarios.delete', 'label' => 'Excluir usuários'],
            ['key' => 'usuarios.restore','label' => 'Restaurar usuários'],

            // TIPOS DE ATENDIMENTO
            ['key' => 'tipos.view',   'label' => 'Visualizar Tipos de Atendimento'],
            ['key' => 'tipos.create', 'label' => 'Criar Tipos de Atendimento'],
            ['key' => 'tipos.update', 'label' => 'Editar Tipos de Atendimento'],
            ['key' => 'tipos.delete', 'label' => 'Excluir Tipos de Atendimento'],
            ['key' => 'tipos.restore', 'label' => 'Restaurar Tipos de Atendimento'],

            // CAMPOS CONFIGURÁVEIS
            ['key' => 'campos.view',   'label' => 'Visualizar Campos Configuráveis'],
            ['key' => 'campos.create', 'label' => 'Criar Campos Configuráveis'],
            ['key' => 'campos.update', 'label' => 'Editar Campos Configuráveis'],
            ['key' => 'campos.delete', 'label' => 'Excluir Campos Configuráveis'],
            ['key' => 'campos.restore', 'label' => 'Restaurar Campos Configuráveis'],

            // LISTAS
            ['key' => 'listas.view',   'label' => 'Visualizar Listas'],
            ['key' => 'listas.create', 'label' => 'Criar Listas'],
            ['key' => 'listas.update', 'label' => 'Editar Listas'],
            ['key' => 'listas.delete', 'label' => 'Excluir Listas'],
            ['key' => 'listas.restore', 'label' => 'Restaurar Listas'],

            // CLIENTES
            ['key' => 'clientes.view',   'label' => 'Visualizar clientes'],
            ['key' => 'clientes.create', 'label' => 'Criar clientes'],
            ['key' => 'clientes.update', 'label' => 'Editar clientes'],
            ['key' => 'clientes.delete', 'label' => 'Excluir clientes'],
            ['key' => 'clientes.restore', 'label' => 'Restaurar clientes'],

            // ATENDIMENTOS
            ['key' => 'atendimentos.view',   'label' => 'Visualizar atendimentos'],
            ['key' => 'atendimentos.create', 'label' => 'Criar atendimentos'],
            ['key' => 'atendimentos.update', 'label' => 'Editar atendimentos'],
            ['key' => 'atendimentos.delete', 'label' => 'Excluir atendimentos'],
            ['key' => 'atendimentos.restore', 'label' => 'Restaurar atendimentos'],

            // DASHBOARD
            ['key' => 'dashboard.master', 'label' => 'Acessar Dashboard Master'],
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(
                ['key' => $permission['key']],
                ['label' => $permission['label']]
            );
        }
    }
}
