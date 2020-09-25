import { Role } from '@shared/enums/role.enum';

export const RolesLabels = {
  [Role.Admin]: 'Admin',
  [Role.Manager]: 'Manager',
  [Role.Member]: 'Member'
};

export const RolesLabelsFilter = {
  '':          'All',
  ...RolesLabels
};
