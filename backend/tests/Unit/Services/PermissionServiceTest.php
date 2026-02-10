<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

use App\Models\User;
use App\Models\Permission;
use App\Models\TipoAtendimento;
use App\Services\PermissionService;

class PermissionServiceTest extends TestCase
{
    use RefreshDatabase;

    protected PermissionService $service;

    protected function setUp(): void
    {
        parent::setUp();

        $this->service = app(PermissionService::class);

        Permission::factory()->create(['key' => 'atendimentos.create']);
        Permission::factory()->create(['key' => 'atendimentos.update']);
    }

    public function test_master_can_do_anything()
    {
        $user = User::factory()->create(['role' => 'master']);
        $tipo = TipoAtendimento::factory()->create();

        $this->assertTrue(
            $this->service->can($user, $tipo, 'atendimentos.create')
        );
    }

    public function test_user_without_permission_is_denied()
    {
        $user = User::factory()->create(['role' => 'atendente']);
        $tipo = TipoAtendimento::factory()->create();

        $this->assertFalse(
            $this->service->can($user, $tipo, 'atendimentos.create')
        );
    }

    public function test_user_with_permission_is_allowed()
    {
        $user = User::factory()->create(['role' => 'atendente']);
        $tipo = TipoAtendimento::factory()->create();

        $permission = Permission::where('key', 'atendimentos.create')->first();

        $user->tipoPermissions()->create([
            'tipo_atendimento_id' => $tipo->id,
            'permission_id' => $permission->id,
            'allowed' => true,
        ]);

        $this->assertTrue(
            $this->service->can($user, $tipo, 'atendimentos.create')
        );
    }
}
