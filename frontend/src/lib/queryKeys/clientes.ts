export const clientesQueryKeys = {
  all: ['clientes'] as const,

  lists: () =>
    [...clientesQueryKeys.all, 'list'] as const,

  detail: (id: number) =>
    [...clientesQueryKeys.all, 'detail', id] as const,

  form: (id: number) =>
    [...clientesQueryKeys.all, 'form', id] as const,
};
