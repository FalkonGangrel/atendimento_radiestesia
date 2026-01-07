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
use App\Http\Controllers\TipoAtendimentoPermissionController; // Importar o novo Controller

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
    // LISTAS (todos autenticados podem visualizar, apenas Master pode criar/editar)
    // ====================================================================
    Route::get('/lists', [ListController::class, 'index']); // Atendentes veem listas ativas (Policy restringe Masters a ver todas)
    Route::post('/lists', [ListController::class, 'store']); // Apenas Master (via Policy)
    Route::put('/lists/{id}', [ListController::class, 'update']); // Apenas Master (via Policy)
    Route::delete('/lists/{id}', [ListController::class, 'destroy']); // Apenas Master (via Policy)

    // ====================================================================
    // ITENS DE LISTAS (apenas Master pode criar/editar)
    // ====================================================================
    Route::post('/list-items', [ListItemController::class, 'store']); // Apenas Master (via Policy)
    Route::put('/list-items/{id}', [ListItemController::class, 'update']); // Apenas Master (via Policy)
    Route::delete('/list-items/{id}', [ListItemController::class, 'destroy']); // Apenas Master (via Policy)

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
    // TIPOS DE ATENDIMENTO (Atendentes veem os permitidos, Masters veem todos)
    // ====================================================================
    Route::get('/tipos-atendimento', [TipoAtendimentoController::class, 'index']); // Lógica de filtragem no Controller
    Route::get('/me/atendimento-permissions', [TipoAtendimentoPermissionController::class, 'getMyPermissions']); // Endpoint para atendentes carregarem suas permissões

    // ====================================================================
    // ROTAS MASTER (protegidas pelo middleware 'master')
    // ====================================================================
    Route::middleware('master')->group(function () {
        // Dashboard Master
        Route::get('/master/stats', [MasterController::class, 'stats']); // Estatísticas gerais do sistema
        Route::get('/dashboard/stats', [DashboardController::class, 'stats']); // Estatísticas por atendente

        // Gerenciamento de Usuários
        Route::apiResource('users', UserController::class)->except(['store']); // Store é feito via AuthController::register
        // A rota de criação de usuário (store) é tratada pelo AuthController::register,
        // mas se você quiser uma rota para Masters criarem usuários diretamente, adicione:
        // Route::post('/users', [UserController::class, 'store']);

        // Gerenciamento de Seções de Campos
        Route::apiResource('field-sections', FieldSectionController::class);

        // Gerenciamento de Campos Customizados
        Route::apiResource('custom-fields', CustomFieldController::class);

        // Gerenciamento de Tipos de Atendimento (CRUD completo para Master)
        Route::post('/tipos-atendimento', [TipoAtendimentoController::class, 'store']);
        Route::get('/tipos-atendimento/{id}', [TipoAtendimentoController::class, 'show']);
        Route::put('/tipos-atendimento/{id}', [TipoAtendimentoController::class, 'update']);
        Route::delete('/tipos-atendimento/{id}', [TipoAtendimentoController::class, 'destroy']);

        // Gerenciamento de Permissões de Tipos de Atendimento por Usuário (APENAS MASTER)
        Route::get('/users/{userId}/tipos-atendimento/{tipoId}/permissions', [TipoAtendimentoPermissionController::class, 'getUserPermissions']);
        Route::post('/users/{userId}/tipos-atendimento/{tipoId}/permissions/sync', [TipoAtendimentoPermissionController::class, 'syncPermissions']);
    });
});
