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
        'tipos-atendimento.view',
        'tipos-atendimento.create',
        'tipos-atendimento.update',

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

        // Atendimentos (se aplicável depois)
        'atendimentos.view',
        'atendimentos.create',
        'atendimentos.update',
    ],
];
