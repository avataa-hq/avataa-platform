import { useEffect } from 'react';
import {
  SidebarLayout,
  keycloakGroupsApi,
  keycloakRolesApi,
  keycloakUsersApi,
  useUserManagement,
} from '6_shared';
import { DialogGroupAdd, DialogRoleAdd } from './ui/dialogBoxes_old';
import { LeftPanel, MainView, DialogDelete, DialogAssign } from './ui';
import { DialogUser } from './ui/lib/dialogBoxes/dialogUser';

const { useGetGroupsQuery } = keycloakGroupsApi;
const { useGetRolesQuery } = keycloakRolesApi;
const { useGetUsersQuery } = keycloakUsersApi;

export const UserManagement: React.FC = () => {
  const { setGroups, setRoles, setUsers } = useUserManagement();

  const { data: usersRTK } = useGetUsersQuery();
  const { data: groupsRTK } = useGetGroupsQuery();
  const { data: rolesRTK } = useGetRolesQuery({});

  useEffect(() => {
    if (!usersRTK || !groupsRTK || !rolesRTK) return;
    setUsers(usersRTK);
    setGroups(groupsRTK);
    setRoles(rolesRTK);
  }, [usersRTK, groupsRTK, rolesRTK]);

  return (
    <SidebarLayout>
      <LeftPanel />
      <MainView />

      <DialogDelete />
      <DialogAssign />
      <DialogUser />

      {/* TODO: The Modals below should be refactored */}
      <DialogGroupAdd />
      <DialogRoleAdd />
    </SidebarLayout>
  );
};
