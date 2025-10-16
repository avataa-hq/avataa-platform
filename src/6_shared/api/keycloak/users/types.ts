export interface GetUsersParams {
  briefRepresentation?: boolean;
  email?: string;
  emailVerified?: boolean;
  enabled?: boolean;
  exact?: boolean;
  first?: number;
  firstName?: string;
  idpAlias?: string;
  idpUserId?: string;
  lastName?: string;
  max?: number;
  search?: string;
  username?: string;
  attributes?: Attributes;
}

interface Attributes {
  [key: string]: string[] | undefined;
}

export type GetUsersCount = Pick<
  GetUsersParams,
  'email' | 'emailVerified' | 'firstName' | 'lastName' | 'search' | 'username'
>;

export interface UserRepresentation {
  id?: string;
  username?: string;
  access?: UserAccess;
  attributes?: Attributes;
  clientConsents?: UserClientConsents;
  clientRoles?: [];
  createdTimestamp?: number;
  credentials?: UserCredentials;
  disableableCredentialTypes?: string[];
  email?: string;
  emailVerified?: boolean;
  enabled?: boolean;
  federatedIdentities?: UserFederatedIdentities;
  federationLink?: string;
  firstName?: string;
  groups?: string[];
  lastName?: string;
  totp?: boolean;
  notBefore?: number;
  origin?: string;
  realmRoles?: string[];
  requiredActions?: string[];
  self?: string;
  serviceAccountClientId?: string;
}

export interface UserCredentials {
  createdDate?: number;
  credentialData?: string;
  id?: string;
  priority?: number;
  secretData?: string;
  temporary?: boolean;
  type?: string;
  userLabel?: string;
  value?: string;
}

interface UserClientConsents {
  clientId?: string;
  createdDate?: number;
  grantedClientScope?: string[];
  lastUpdatedDate?: number;
}

interface UserFederatedIdentities {
  identityProvided?: string;
  userId?: string;
  userName?: string;
}

interface UserUpdateAccountEmailQuery {
  client_id?: string;
  lifespan?: number;
  redirect_uri?: string;
  actions?: string[];
}

interface UserAccess {
  manageGroupMembership: boolean;
  view: boolean;
  mapRoles: boolean;
  impersonate: boolean;
  manage: boolean;
}

export interface UserGroup {
  id: string;
  name: string;
  path: string;
}

export interface UserRoleMapping {
  realmMappings: UserRole[];
}

export interface UserRole {
  id: string;
  name: string;
  description: string;
  composite: boolean;
  clientRole: boolean;
  containerId: string;
}

export type NewUserRole = Partial<UserRole>;

export interface UserPasswordUpdate {
  type?: string;
  value: string;
  temporary?: boolean;
}
