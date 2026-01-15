export const atendimentosQueryKeys = {
  all: ['atendimentos'] as const,

  lists: () =>
    [...atendimentosQueryKeys.all, 'list'] as const,

  detail: (id: number) =>
    [...atendimentosQueryKeys.all, 'detail', id] as const,
};
