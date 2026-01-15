export const fieldSectionsQueryKeys = {
  all: ['fieldSections'] as const,
  lists: () => [...fieldSectionsQueryKeys.all, 'list'] as const,
};
