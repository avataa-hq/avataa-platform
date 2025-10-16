export interface SecurityMiddlewareLowLevelModel {
  clientRole: boolean;
  composite: boolean;
  containerId: string | null;
  description: string | null;
  id: string | null;
  nameForKeycloak: string | null;
  nameForUser: string;
  nameForMicroservices: string;
}

export interface UserInfo {
  sub?: string;
  upn?: string;
  resource_access?: {
    [key: string]: RolesIssued;
  };
  realm_access?: RolesIssued;
  name?: string;
  groups?: string[];
  preferred_username?: string;
  given_name?: string;
  locale?: string;
  family_name?: string;
  picture?: string;
}

type RolesIssued = {
  roles?: string[];
};
