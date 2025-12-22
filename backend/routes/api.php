<?php
// routes/api.php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AtendimentoController;
use App\Http\Controllers\ListController;
use App\Http\Controllers\ListItemController;
use App\Http\Controllers\DashboardController;
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

    // Autenticação
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/logout-all', [AuthController::class, 'logoutAll']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // Listas (todos podem visualizar, apenas Master pode criar/editar)
    Route::get('/lists', [ListController::class, 'index']);
    Route::post('/lists', [ListController::class, 'store']);
    Route::put('/lists/{id}', [ListController::class, 'update']);
    Route::delete('/lists/{id}', [ListController::class, 'destroy']);

    // Itens de Listas (apenas Master pode criar/editar)
    Route::post('/list-items', [ListItemController::class, 'store']);
    Route::put('/list-items/{id}', [ListItemController::class, 'update']);
    Route::delete('/list-items/{id}', [ListItemController::class, 'destroy']);

    // Atendimentos (cada usuário vê apenas os seus)
    Route::apiResource('atendimentos', AtendimentoController::class);
    Route::get('/atendimentos/stats', [AtendimentoController::class, 'stats']);

    // Dashboard (apenas Master)
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
});
