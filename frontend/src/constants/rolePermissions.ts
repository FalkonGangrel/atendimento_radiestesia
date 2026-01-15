import { Permissions } from './permissions';
import { Roles } from './roles';

export const rolePermissions = {
  [Roles.MASTER]: [
    Permissions.DASHBOARD_MASTER,
    Permissions.LISTS_MANAGE,
    Permissions.ATENDIMENTO_CREATE,
    Permissions.ATENDIMENTO_VIEW_ALL,
  ],

  [Roles.ADMIN]: [
    Permissions.ATENDIMENTO_CREATE,
    Permissions.ATENDIMENTO_VIEW_ALL,
  ],

  [Roles.USER]: [
    Permissions.ATENDIMENTO_CREATE,
  ],
};
