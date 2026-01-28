<?php

return [
    'master' => [

        'campos.manage',

        'clientes.create',
        'clientes.update',
        'clientes.delete',
        'clientes.view',
        'clientes.view_owner',

        'dashboard.master',

        'listas.manage',

        'tipos-atendimento.manage',

        'usuarios.manage',
        'usuarios.create',
        'usuarios.update',
        'usuarios.delete',
        'usuarios.view',
    ],

    'admin' => [
        'dashboard.master',
        'tipos-atendimento.manage',
    ],

    'atendente' => [
        'clientes.create',
        'clientes.update',
        'clientes.delete',
        'clientes.view',
    ],
];
