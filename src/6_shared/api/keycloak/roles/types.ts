export interface GetRolesParams {
  briefRepresentation?: boolean;
  first?: number;
  max?: number;
  search?: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  composite: boolean;
  clientRole: boolean;
  containerId: string;
  attributes?: { [key: string]: string[] };
  composites?: Composite[];
}

export type NewRole = Partial<Omit<Role, 'id'>>;
export type RolePartial = Partial<Role>;

export interface Composite {
  id: string;
  name: string;
  description: string;
  composite: boolean;
  clientRole: boolean;
  containerId: string;
}

export interface GetRoleUsersParams {
  first?: number;
  max?: number;
}

export interface GetRoleGroupsParams {
  briefRepresentation?: boolean;
  first?: number;
  max?: number;
}

export interface RoleGroup {
  id: string;
  name: string;
  path: string;
  attributes?: [];
  realmRoles?: string[];
  clientRoles?: string[];
}
