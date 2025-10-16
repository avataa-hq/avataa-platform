import { useMemo } from 'react';
import { keycloakUsersApi } from '6_shared';

export const useGetUsers = () => {
  const { useGetUsersQuery } = keycloakUsersApi;

  const { data: usersData, isFetching: isUsersFetching } = useGetUsersQuery();

  const userNamesList = useMemo(() => {
    if (!usersData) return [];
    return usersData.flatMap((u) => (u.username ? u.username : []));
  }, [usersData]);

  return { usersData, userNamesList, isUsersFetching };
};
