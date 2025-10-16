import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { keycloakUsersApi } from '6_shared';

interface IProps {
  owner: string;
}

export const FileOwner = ({ owner }: IProps) => {
  const [usersList, setUsersList] = useState<string[]>([]);
  const { useGetUsersQuery } = keycloakUsersApi;
  const { data: usersData } = useGetUsersQuery();

  useEffect(() => {
    if (!usersData) return;
    const users = usersData
      .filter((item) => item.username !== undefined)
      .map((item) => item.username);

    setUsersList(users as string[]);
  }, [usersData]);

  return <Typography variant="body2">{usersList.includes(owner) ? owner : 'No owner'}</Typography>;
};
