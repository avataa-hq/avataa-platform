import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IGroup, IRole, IUser, ItemType, UserDialogType } from './types';

interface IInitialState {
  users: IUser[];
  groups: IGroup[];
  roles: IRole[];
  selectedObject: string;
  selectedUser: IUser;
  selectedGroup: IGroup;
  selectedRole: IGroup;
  parentGroup: IGroup | null;
  isDialogAddGroupOpen: boolean;
  isDialogEditGroupOpen: boolean;
  isDialogDeleteOpen: boolean;
  isDialogAssignOpen: boolean;
  relatedItem: [ItemType, string];
  isDialogResetCredentialsOpen: boolean;
  isDialogAddRoleOpen: boolean;
  isDialogEditRoleOpen: boolean;
  isDialogGroupInfoOpen: boolean;
  nameOfItem: string;
  nameOfEditItem: string;
  searchValue: string;
  isDialogUserOpen: boolean;
  userDialogType: UserDialogType;
}

const initialState: IInitialState = {
  users: [] as IUser[],
  groups: [] as IGroup[],
  roles: [] as IRole[],
  selectedObject: 'Users',
  selectedUser: {} as IUser,
  selectedGroup: {} as IGroup,
  selectedRole: {} as IGroup,
  parentGroup: {} as IGroup,
  isDialogAddGroupOpen: false,
  isDialogEditGroupOpen: false,
  relatedItem: [{}, ''],
  isDialogDeleteOpen: false,
  isDialogAssignOpen: false,
  isDialogResetCredentialsOpen: false,
  isDialogAddRoleOpen: false,
  isDialogEditRoleOpen: false,
  isDialogGroupInfoOpen: false,
  nameOfItem: '',
  nameOfEditItem: '',
  searchValue: '',
  isDialogUserOpen: false,
  userDialogType: '',
};

const userManagementSlice = createSlice({
  name: 'userManagement',
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<IUser[]>) {
      state.users = [];
      action.payload?.forEach((item: IUser) => state.users.push(item));
    },
    setGroups(state, action: PayloadAction<IGroup[]>) {
      state.groups = [];
      action.payload?.forEach((item: IGroup) => state.groups.push(item));
    },
    setRoles(state, action: PayloadAction<IRole[]>) {
      state.roles = [];
      action.payload?.forEach((item: IRole) => state.roles.push(item));
    },
    setSelectedUser(state, action: PayloadAction<IUser>) {
      state.selectedUser = action.payload;
    },
    setSelectedGroup(state, action: PayloadAction<IGroup>) {
      state.selectedGroup = action.payload;
    },
    setSelectedRole(state, action: PayloadAction<IGroup>) {
      state.selectedRole = action.payload;
    },
    setSelectedObject(state, action: PayloadAction<string>) {
      state.selectedObject = action.payload;
    },
    setParentGroup(state, action: PayloadAction<IGroup | null>) {
      state.parentGroup = action.payload;
    },
    setIsDialogAddGroupOpen(state, action: PayloadAction<boolean>) {
      state.isDialogAddGroupOpen = action.payload;
    },
    setIsDialogEditGroupOpen(state, action: PayloadAction<boolean>) {
      state.isDialogEditGroupOpen = action.payload;
    },
    setRelatedItem(state, action: PayloadAction<[ItemType, string]>) {
      state.relatedItem = action.payload;
    },
    setIsDialogDeleteOpen(state, action: PayloadAction<boolean>) {
      state.isDialogDeleteOpen = action.payload;
    },
    setIsDialogAssignOpen(state, action: PayloadAction<boolean>) {
      state.isDialogAssignOpen = action.payload;
    },
    setIsDialogResetCredentialsOpen(state, action: PayloadAction<boolean>) {
      state.isDialogResetCredentialsOpen = action.payload;
    },
    setIsDialogAddRoleOpen(state, action: PayloadAction<boolean>) {
      state.isDialogAddRoleOpen = action.payload;
    },
    setIsDialogEditRoleOpen(state, action: PayloadAction<boolean>) {
      state.isDialogEditRoleOpen = action.payload;
    },
    setIsDialogGroupInfoOpen(state, action: PayloadAction<boolean>) {
      state.isDialogGroupInfoOpen = action.payload;
    },
    setNameOfItem(state, action: PayloadAction<string>) {
      state.nameOfItem = action.payload;
    },
    setNameOfEditItem(state, action: PayloadAction<string>) {
      state.nameOfEditItem = action.payload;
    },
    setUserDialogType(state, action: PayloadAction<UserDialogType>) {
      state.userDialogType = action.payload;
    },
    setIsDialogUserOpen(state, action: PayloadAction<boolean>) {
      state.isDialogUserOpen = action.payload;
    },
    setSearchValue: (s, a: PayloadAction<string>) => {
      s.searchValue = a.payload;
    },

    restore: (_, action: PayloadAction<IInitialState>) => action.payload,
  },
});

export const userManagementActions = userManagementSlice.actions;
export const userManagementReducer = userManagementSlice.reducer;
export const userManagementSliceName = userManagementSlice.name;
