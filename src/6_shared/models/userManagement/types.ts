export interface IUser {
  username?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface IGroup {
  name?: string;
  id?: string;
  path?: string;
  subGroups?: IGroup[];
}

export interface IRole {
  name?: string;
  id?: string;
}

export type ItemType = IUser | IGroup | IRole;

export type UserDialogType = 'add' | 'edit' | 'info' | 'password' | '';
