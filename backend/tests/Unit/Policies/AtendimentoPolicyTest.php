<?php

namespace Tests\Unit\Policies;

use Tests\TestCase;
use App\Models\User;
use App\Models\TemplateAtendimento;
use App\Models\TipoAtendimento;
use App\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AtendimentoPolicyTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Permission::factory()->create(['key' => 'atendimentos.view']);
        Permission::factory()->create(['key' => 'atendimentos.create']);
        Permission::factory()->create(['key' => 'atendimentos.update']);
        Permission::factory()->create(['key' => 'atendimentos.delete']);
    }

    public function test_master_can_do_anything()
    {
        $user = User::factory()->create(['role' => 'master']);
        $tipo = TipoAtendimento::factory()->create();

        $this->assertTrue(
            $user->can('create', $tipo)
        );
    }

    public function test_user_without_permission_cannot_create()
    {
        $user = User::factory()->create(['role' => 'atendente']);
        $tipo = TipoAtendimento::factory()->create();

        $this->assertFalse(
            $user->can('create', $tipo)
        );
    }

    public function test_user_with_permission_can_create()
    {
        $user = User::factory()->create(['role' => 'atendente']);
        $tipo = TipoAtendimento::factory()->create();

        $user->tipoPermissions()->create([
            'tipo_atendimento_id' => $tipo->id,
            'permission_id' => Permission::where('key', 'atendimentos.create')->first()->id,
            'allowed' => true,
        ]);

        $this->assertTrue(
            $user->can('create', $tipo)
        );
    }

    public function test_user_cannot_update_other_tipo()
    {
        $user = User::factory()->create(['role' => 'atendente']);
        $tipoPermitido = TipoAtendimento::factory()->create();
        $tipoNegado = TipoAtendimento::factory()->create();

        $user->tipoPermissions()->create([
            'tipo_atendimento_id' => $tipoPermitido->id,
            'permission_id' => Permission::where('key', 'atendimentos.update')->first()->id,
            'allowed' => true,
        ]);

        $atendimento = TemplateAtendimento::factory()->create([
            'tipo_atendimento_id' => $tipoNegado->id
        ]);

        $this->assertFalse(
            $user->can('update', $atendimento)
        );
    }
}
