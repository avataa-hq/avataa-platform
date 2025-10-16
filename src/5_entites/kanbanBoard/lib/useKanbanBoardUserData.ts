import { useMemo } from 'react';
import { keycloakUsersApi } from '6_shared';

export const useKanbanBoardUserData = () => {
  const { useGetUsersQuery } = keycloakUsersApi;

  const { data: usersData } = useGetUsersQuery();

  const userNamesList = useMemo(() => {
    if (!usersData) return [];
    return usersData.flatMap((u) => (u.username ? u.username : []));
  }, [usersData]);

  return { userNamesList, usersData };
};
