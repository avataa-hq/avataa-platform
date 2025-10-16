export interface Group {
  id: string;
  name: string;
  path: string;
  subGroups: Group[];
  attributes?: [];
  realmRoles?: string[];
  clientRoles?: [];
  access?: [];
}

export interface GetGroupsParams {
  briefRepresentation?: boolean;
  first?: number;
  max?: number;
  search?: string;
}

export type NewGroup = Partial<Group>;

export interface GetGroupCountParams {
  top?: boolean;
  search?: string;
}

export type GetGroupUsers = Omit<GetGroupsParams, 'search'>;

export interface GroupUser {
  id: string;
  createdTimestamp: number;
  username: string;
  enabled: boolean;
  totp: boolean;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  email: string;
  disableableCredentialTypes: any[];
  requiredActions: string[];
  notBefore: number;
}

export interface GroupRoleMapping {
  realmMappings: GroupRole[];
}

export interface GroupRole {
  id: string;
  name: string;
  description: string;
  composite: boolean;
  clientRole: boolean;
  containerId: string;
}

export type NewGroupRole = Partial<GroupRole>;
