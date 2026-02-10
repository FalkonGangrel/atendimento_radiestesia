<?php

return [

    /*
    |--------------------------------------------------------------------------
    | MASTER
    |--------------------------------------------------------------------------
    | Master é tratado no BasePolicy (before).
    | Não precisa listar permissões aqui.
    */
    'master' => [],

    /*
    |--------------------------------------------------------------------------
    | ADMIN
    |--------------------------------------------------------------------------
    | Perfil administrativo sem poder absoluto
    */
    'admin' => [

        // Dashboard
        'dashboard.view',

        // Tipos de Atendimento
        'tipos.view',
        'tipos.create',
        'tipos.update',

        // Listas
        'listas.view',
        'listas.create',
        'listas.update',

        // Clientes
        'clientes.view',
        'clientes.create',
        'clientes.update',

        // Usuários (sem role / delete)
        'usuarios.view',
        'usuarios.update',
    ],

    /*
    |--------------------------------------------------------------------------
    | ATENDENTE
    |--------------------------------------------------------------------------
    | Usuário operacional
    */
    'atendente' => [

        // Clientes
        'clientes.view',
        'clientes.create',
        'clientes.update',
        'clientes.delete',

        // Atendimentos
        'atendimentos.view',
        'atendimentos.create',
        'atendimentos.update',
    ],
];
