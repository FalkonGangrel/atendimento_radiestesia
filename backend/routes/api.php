<?php

use App\Http\Controllers\AdminDashboardController;
use App\Models\TemplateAtendimento;
use App\Models\TipoAtendimento;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AtendimentoController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\CustomFieldController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FieldSectionController;
use App\Http\Controllers\ListController;
use App\Http\Controllers\ListItemController;
use App\Http\Controllers\MasterController;
use App\Http\Controllers\TipoAtendimentoController;
use App\Http\Controllers\TipoAtendimentoPermissionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserTipoPermissionController;

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Rotas Públicas
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

/*
|--------------------------------------------------------------------------
| Rotas Protegidas
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // ============================
    // AUTENTICAÇÃO
    // ============================
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/logout-all', [AuthController::class, 'logoutAll']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // ============================
    // DASHBOARD
    // ============================
    Route::get('/dashboard/stats', [DashboardController::class, 'stats'])
        ->middleware('permission:dashboard.master');

    Route::get('/master/stats', [AdminDashboardController::class, 'stats'])
        ->middleware('permission:dashboard.master');

    // ============================
    // LISTAS
    // ============================
    Route::get('/lists', [ListController::class, 'index']);

    Route::post('/lists', [ListController::class, 'store'])
        ->middleware('permission:listas.manage');

    Route::put('/lists/{id}', [ListController::class, 'update'])
        ->middleware('permission:listas.manage');

    Route::delete('/lists/{id}', [ListController::class, 'destroy'])
        ->middleware('permission:listas.manage');

    // ============================
    // ITENS DE LISTA
    // ============================
    Route::post('/list-items', [ListItemController::class, 'store'])
        ->middleware('permission:listas.manage');

    Route::put('/list-items/{id}', [ListItemController::class, 'update'])
        ->middleware('permission:listas.manage');

    Route::delete('/list-items/{id}', [ListItemController::class, 'destroy'])
        ->middleware('permission:listas.manage');

    // ============================
    // ATENDIMENTOS
    // ============================
    Route::get('/atendimentos/stats', [AtendimentoController::class, 'stats']);

    // Listar atendimentos por tipo
    Route::get('/atendimentos', [AtendimentoController::class, 'index']);

    // Criar atendimento (depende do tipo)
    Route::post('/atendimentos', [AtendimentoController::class, 'store'])
        ->middleware('can:create,App\Models\TipoAtendimento');

    // Visualizar atendimento específico
    Route::get('/atendimentos/{atendimento}', [AtendimentoController::class, 'show'])
        ->middleware('can:view,atendimento');

    // Atualizar atendimento
    Route::put('/atendimentos/{atendimento}', [AtendimentoController::class, 'update'])
        ->middleware('can:update,atendimento');

    // Deletar atendimento
    Route::delete('/atendimentos/{atendimento}', [AtendimentoController::class, 'destroy'])
        ->middleware('can:delete,atendimento');

    // ============================
    // CLIENTES
    // ============================
    Route::apiResource('clientes', ClienteController::class);

    // ============================
    // TIPOS DE ATENDIMENTO
    // ============================
    Route::get('/tipos-atendimento', [TipoAtendimentoController::class, 'index']);

    Route::get('/tipos-atendimento/{tipo}/estrutura', [TipoAtendimentoController::class, 'estrutura']);

    Route::post('/tipos-atendimento', [TipoAtendimentoController::class, 'store'])
        ->middleware('permission:tipos-atendimento.manage');

    Route::get('/tipos-atendimento/{id}', [TipoAtendimentoController::class, 'show'])
        ->middleware('permission:tipos-atendimento.manage');

    Route::put('/tipos-atendimento/{id}', [TipoAtendimentoController::class, 'update'])
        ->middleware('permission:tipos-atendimento.manage');

    Route::delete('/tipos-atendimento/{id}', [TipoAtendimentoController::class, 'destroy'])
        ->middleware('permission:tipos-atendimento.manage');

    // ============================
    // USUÁRIOS
    // ============================
    Route::get('/users', [UserController::class, 'index'])
        ->middleware('permission:usuarios.view');

    Route::get('/users/{id}', [UserController::class, 'show'])
        ->middleware('permission:usuarios.view');

    Route::put('/users/{id}', [UserController::class, 'update'])
        ->middleware('permission:usuarios.update');

    Route::delete('/users/{id}', [UserController::class, 'destroy'])
        ->middleware('permission:usuarios.delete');

    Route::post('/users/{id}/restore', [UserController::class, 'restore'])
        ->middleware('permission:usuarios.restore')
        ->withTrashed();


    // ============================
    // PERMISSÕES GRANULARES DE USUÁRIOS POR ROLE (MASTER)
    // ============================
    Route::get(
        '/users/{user}/permissions/{tipo}',
        [UserTipoPermissionController::class, 'show']
    );

    Route::post(
        '/users/{user}/permissions/{tipo}',
        [UserTipoPermissionController::class, 'store']
    );

    // ============================
    // PERMISSÕES POR TIPO DE ATENDIMENTO
    // ============================
    Route::get(
        '/tipos-atendimento/{tipo}/permissions',
        [TipoAtendimentoPermissionController::class, 'show']
    );
});
