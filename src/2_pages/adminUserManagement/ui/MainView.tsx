import { useState } from 'react';
import {
  SidebarLayout,
  useDebounceValue,
  useTranslate,
  keycloakGroupsApi,
  keycloakRolesApi,
  keycloakUsersApi,
  useUserManagement,
  IGroup,
  IUser,
} from '6_shared';
import { Title, Content } from './MainView.styled';
import { TablePanel } from './lib/TablePanel';
import { sortedSearchList } from './lib';

const { useGetGroupRolesQuery, useGetUsersInGroupQuery, useGetGroupCompositeRolesQuery } =
  keycloakGroupsApi;
const { useGetRoleGroupsQuery, useGetRoleUsersQuery } = keycloakRolesApi;
const { useGetUserGroupsQuery, useGetUserRolesQuery, useGetUserCompositeRolesQuery } =
  keycloakUsersApi;

export const MainView = () => {
  const translate = useTranslate();
  const { Container } = SidebarLayout;

  const [userSearchValue, setUserSearchValue] = useState('');
  const [groupSearchValue, setGroupSearchValue] = useState('');
  const [roleSearchValue, setRoleSearchValue] = useState('');

  const userSearchDebounceValue = useDebounceValue(userSearchValue);
  const groupSearchDebounceValue = useDebounceValue(groupSearchValue);
  const roleSearchDebounceValue = useDebounceValue(roleSearchValue);

  const {
    selectedObject,
    selectedUser,
    selectedGroup,
    selectedRole,
    setRelatedItem,
    setIsDialogAssignOpen,
    setIsDialogDeleteOpen,
  } = useUserManagement();

  const { data: roleGroups = [] } = useGetRoleGroupsQuery([selectedRole.name!, {}], {
    skip: !selectedRole.name,
  });
  const { data: roleUsers = [] } = useGetRoleUsersQuery([selectedRole.name!, {}], {
    skip: !selectedRole.name,
  });
  const { data: userRoles } = useGetUserRolesQuery(selectedUser.id!, {
    skip: !selectedUser.id,
  });
  const { data: userCompositeRoles } = useGetUserCompositeRolesQuery([selectedUser.id!], {
    skip: !selectedUser.id,
  });
  const { data: userGroups = [] } = useGetUserGroupsQuery(selectedUser.id!, {
    skip: !selectedUser.id,
  });
  const { data: groupUsers = [] } = useGetUsersInGroupQuery([selectedGroup.id!], {
    skip: !selectedGroup.id,
  });
  const { data: groupRoles } = useGetGroupRolesQuery(selectedGroup.id!, {
    skip: !selectedGroup.id,
  });
  const { data: groupCompositeRoles } = useGetGroupCompositeRolesQuery([selectedGroup.id!], {
    skip: !selectedGroup.id,
  });

  const userInheritedRoles =
    userCompositeRoles && userRoles?.realmMappings
      ? userCompositeRoles.filter((obj2) => {
          return !userRoles.realmMappings.some((obj1) => obj1.id === obj2.id);
        })
      : [];

  const groupInheritedRoles: any =
    groupCompositeRoles && groupRoles?.realmMappings
      ? groupCompositeRoles.filter((obj2) => {
          return !groupRoles.realmMappings.some((obj1) => obj1.id === obj2.id);
        })
      : [];

  const onDeleteUserGroup = (item: IGroup) => {
    setRelatedItem([item, 'group']);
    setIsDialogDeleteOpen(true);
  };

  const onDeleteRoleGroup = (item: IGroup) => {
    setRelatedItem([item, 'group']);
    setIsDialogDeleteOpen(true);
  };

  const onDeleteGroupUser = (item: IUser) => {
    setRelatedItem([item, 'user']);
    setIsDialogDeleteOpen(true);
  };

  const onDeleteRoleUser = (item: IUser) => {
    setRelatedItem([item, 'user']);
    setIsDialogDeleteOpen(true);
  };

  const onDeleteUserRole = (item: IGroup) => {
    setRelatedItem([item, 'role']);
    setIsDialogDeleteOpen(true);
  };

  const onDeleteGroupRole = (item: IGroup) => {
    setRelatedItem([item, 'role']);
    setIsDialogDeleteOpen(true);
  };

  const onAssignUserGroup = () => {
    setRelatedItem([{}, 'group']);
    setIsDialogAssignOpen(true);
  };

  const onAssignRoleGroup = () => {
    setRelatedItem([{}, 'group']);
    setIsDialogAssignOpen(true);
  };

  const onAssignGroupUser = () => {
    setRelatedItem([{}, 'user']);
    setIsDialogAssignOpen(true);
  };

  const onAssignRoleUser = () => {
    setRelatedItem([{}, 'user']);
    setIsDialogAssignOpen(true);
  };

  const onAssignUserRole = () => {
    setRelatedItem([{}, 'role']);
    setIsDialogAssignOpen(true);
  };

  const onAssignGroupRole = () => {
    setRelatedItem([{}, 'role']);
    setIsDialogAssignOpen(true);
  };

  return (
    <Container padding="20px">
      <Title component="h2">{translate('Management')}</Title>
      <Content>
        {selectedObject !== 'Groups' && (
          <TablePanel
            panelTitle={translate('Groups')}
            searchValue={groupSearchValue}
            setSearchValue={setGroupSearchValue}
            onAssign={selectedObject === 'Users' ? onAssignUserGroup : onAssignRoleGroup}
            list={sortedSearchList(
              groupSearchDebounceValue || '',
              selectedObject === 'Users' ? userGroups : roleGroups,
            )}
            onDeleteClick={selectedObject === 'Users' ? onDeleteUserGroup : onDeleteRoleGroup}
          />
        )}

        {selectedObject !== 'Users' && (
          <TablePanel
            panelTitle={translate('Users')}
            searchValue={userSearchValue}
            setSearchValue={setUserSearchValue}
            onAssign={selectedObject === 'Groups' ? onAssignGroupUser : onAssignRoleUser}
            list={sortedSearchList(
              userSearchDebounceValue || '',
              selectedObject === 'Groups' ? groupUsers : roleUsers,
            )}
            onDeleteClick={selectedObject === 'Groups' ? onDeleteGroupUser : onDeleteRoleUser}
          />
        )}

        {selectedObject !== 'Roles' && (
          <TablePanel
            panelTitle={translate('Roles')}
            searchValue={roleSearchValue}
            setSearchValue={setRoleSearchValue}
            onAssign={selectedObject === 'Users' ? onAssignUserRole : onAssignGroupRole}
            list={sortedSearchList(
              roleSearchDebounceValue || '',
              selectedObject === 'Users'
                ? userRoles?.realmMappings ?? []
                : groupRoles?.realmMappings ?? [],
            )}
            inheritedList={sortedSearchList(
              roleSearchDebounceValue || '',
              selectedObject === 'Users' ? userInheritedRoles ?? [] : groupInheritedRoles ?? [],
            )}
            onDeleteClick={selectedObject === 'Users' ? onDeleteUserRole : onDeleteGroupRole}
          />
        )}
      </Content>
    </Container>
  );
};
