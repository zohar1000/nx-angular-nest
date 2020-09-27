import { Role } from '@shared/enums/role.enum';

export const RoleLabels = {
  [Role.Owner]: 'Owner',
  [Role.Admin]: 'Admin',
  [Role.Manager]: 'Manager',
  [Role.Member]: 'Member'
};

export const RoleRank = {
  [Role.Owner]: 100,
  [Role.Admin]: 80,
  [Role.Manager]: 60,
  [Role.Member]: 40
};

export const RoleLabelsFilter = {
  '':          'All',
  ...RoleLabels
};
