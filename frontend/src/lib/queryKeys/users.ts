export const usersQueryKeys = {
  all: ['users'] as const,
  lists: () => [...usersQueryKeys.all, 'list'] as const,
  detail: (id: number) => [...usersQueryKeys.all, 'detail', id] as const,
};
