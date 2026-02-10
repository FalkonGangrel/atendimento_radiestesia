<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Permission;
use App\Models\TipoAtendimento;
use App\Models\UserTipoPermission;

class UserTipoPermissionSeeder extends Seeder
{
    public function run(): void
    {
        $atendentes = User::where('role', 'atendente')->get();
        $tipos = TipoAtendimento::where('ativo', true)->get();

        if (!$atendentes->count() || !$tipos->count()) {
            return;
        }

        $permissions = Permission::whereIn('key', [
            'atendimentos.view',
            'atendimentos.create',
            'clientes.create',
            'clientes.view',
            'clientes.update',
            'clientes.delete',
            'clientes.restore',
        ])->get();

        foreach ($atendentes as $atendente) {
            foreach ($tipos as $tipo) {
                foreach ($permissions as $permission) {
                    UserTipoPermission::firstOrCreate([
                        'user_id' => $atendente->id,
                        'tipo_atendimento_id' => $tipo->id,
                        'permission_id' => $permission->id,
                    ], [
                        'allowed' => true,
                    ]);
                }
            }
        }
    }
}
