module.exports = function (plop) {
    plop.setGenerator('page', {
        description: 'Cria uma página React em src/pages',
        prompts: [
        {
            type: 'input',
            name: 'name',
            message: 'Nome da página (ex: ClienteForm)',
        },
        ],
        actions: [
        {
            type: 'add',
            path: 'src/pages/{{pascalCase name}}.tsx',
            templateFile: 'plop-templates/page.tsx.hbs',
        },
        ],
    });
};
