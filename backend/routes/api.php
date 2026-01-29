<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AtendimentoController;
use App\Http\Controllers\ListController;
use App\Http\Controllers\ListItemController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MasterController;
use App\Http\Controllers\FieldSectionController;
use App\Http\Controllers\CustomFieldController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TipoAtendimentoController;
use App\Http\Controllers\TipoAtendimentoPermissionController;

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Rotas Públicas
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

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

    Route::get('/master/stats', [MasterController::class, 'stats'])
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
    Route::apiResource('atendimentos', AtendimentoController::class);

    // ============================
    // CLIENTES
    // ============================
    Route::apiResource('clientes', ClienteController::class);

    // ============================
    // TIPOS DE ATENDIMENTO
    // ============================
    Route::get('/tipos-atendimento', [TipoAtendimentoController::class, 'index']);

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
        ->middleware('permission:usuarios.restore');

    // ============================
    // PERMISSÕES DE TIPO DE ATENDIMENTO (MASTER)
    // ============================
    Route::get(
        '/users/{userId}/tipos-atendimento/{tipoId}/permissions',
        [TipoAtendimentoPermissionController::class, 'getUserPermissions']
    )->middleware('permission:usuarios.manage');

    Route::post(
        '/users/{userId}/tipos-atendimento/{tipoId}/permissions/sync',
        [TipoAtendimentoPermissionController::class, 'syncPermissions']
    )->middleware('permission:usuarios.manage');

    Route::get(
        '/me/atendimento-permissions',
        [TipoAtendimentoPermissionController::class, 'getMyPermissions']
    );
});
