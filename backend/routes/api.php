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
use App\Http\Controllers\UserFieldPermissionController;
use App\Http\Controllers\TipoAtendimentoController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Rotas Públicas (sem autenticação)
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Rotas Protegidas (requer autenticação)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // ====================================================================
    // AUTENTICAÇÃO
    // ====================================================================
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/logout-all', [AuthController::class, 'logoutAll']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // ====================================================================
    // CAMPOS CUSTOMIZADOS - Todos podem ver seus campos permitidos
    // ====================================================================
    Route::get('/custom-fields/my-fields', [CustomFieldController::class, 'getForCurrentUser']);

    // ====================================================================
    // LISTAS (todos podem visualizar, apenas Master pode criar/editar)
    // ====================================================================
    Route::get('/lists', [ListController::class, 'index']);
    Route::post('/lists', [ListController::class, 'store']);
    Route::put('/lists/{id}', [ListController::class, 'update']);
    Route::delete('/lists/{id}', [ListController::class, 'destroy']);

    // ====================================================================
    // ITENS DE LISTAS (apenas Master pode criar/editar)
    // ====================================================================
    Route::post('/list-items', [ListItemController::class, 'store']);
    Route::put('/list-items/{id}', [ListItemController::class, 'update']);
    Route::delete('/list-items/{id}', [ListItemController::class, 'destroy']);

    // ====================================================================
    // ATENDIMENTOS (todos os usuários autenticados)
    // ====================================================================
    Route::get('/atendimentos/stats', [AtendimentoController::class, 'stats']);
    Route::apiResource('atendimentos', AtendimentoController::class);

    // ====================================================================
    // CLIENTES (todos os usuários autenticados)
    // ====================================================================
    Route::apiResource('clientes', ClienteController::class);

    // ====================================================================
    // TIPOS DE ATENDIMENTO (todos podem visualizar, apenas Master pode criar/editar)
    // ====================================================================
    Route::get('/tipos-atendimento', [TipoAtendimentoController::class, 'index']);

    // ====================================================================
    // ROTAS MASTER (protegidas pelo middleware 'master')
    // ====================================================================
    Route::middleware('master')->group(function () {

        // Dashboard Master
        Route::get('/master/stats', [MasterController::class, 'stats']);
        Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

        // Gerenciamento de Seções de Campos
        Route::get('/field-sections', [FieldSectionController::class, 'index']);
        Route::post('/field-sections', [FieldSectionController::class, 'store']);
        Route::put('/field-sections/{id}', [FieldSectionController::class, 'update']);
        Route::delete('/field-sections/{id}', [FieldSectionController::class, 'destroy']);

        // Gerenciamento de Campos Customizados
        Route::get('/custom-fields', [CustomFieldController::class, 'index']);
        Route::post('/custom-fields', [CustomFieldController::class, 'store']);
        Route::put('/custom-fields/{id}', [CustomFieldController::class, 'update']);
        Route::delete('/custom-fields/{id}', [CustomFieldController::class, 'destroy']);

        // Gerenciamento de Usuários
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);

        //Gerenciamento de Tipos de Atendimento
        Route::post('/tipos-atendimento', [TipoAtendimentoController::class, 'store']);
        Route::get('/tipos-atendimento/{id}', [TipoAtendimentoController::class, 'show']);
        Route::put('/tipos-atendimento/{id}', [TipoAtendimentoController::class, 'update']);
        Route::delete('/tipos-atendimento/{id}', [TipoAtendimentoController::class, 'destroy']);

        // Gerenciamento de Permissões de Campos por Usuário
        Route::get('/users/{userId}/permissions', [UserFieldPermissionController::class, 'getUserPermissions']);
        Route::post('/users/{userId}/permissions/sync', [UserFieldPermissionController::class, 'syncUserPermissions']);
        Route::post('/users/{userId}/permissions/grant', [UserFieldPermissionController::class, 'grantPermission']);
        Route::delete('/users/{userId}/permissions/{fieldId}', [UserFieldPermissionController::class, 'revokePermission']);

    });

});
