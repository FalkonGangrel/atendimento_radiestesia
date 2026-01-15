export const permissionsQueryKeys = {
  all: ['permissions'] as const,

  userTipo: (userId: number, tipoId: number) =>
    [...permissionsQueryKeys.all, 'user', userId, 'tipo', tipoId] as const,
};
