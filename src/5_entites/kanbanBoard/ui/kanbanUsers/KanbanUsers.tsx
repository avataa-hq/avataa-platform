import React, { useMemo, useState } from 'react';
import { Avatar, Tooltip, Menu, MenuItem, Box, useTheme } from '@mui/material';
import { useGetUsers } from '5_entites/inventory';
import { getInitials } from '5_entites/kanbanBoard/lib';

interface IProps {
  onSearchClick: (value: string) => void;
}

export const KanbanUsers = ({ onSearchClick }: IProps) => {
  const theme = useTheme();
  const { usersData } = useGetUsers();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const users = useMemo(
    () =>
      usersData?.map((u, i) => ({
        id: u.id || String(i),
        name: u.username || '',
        avatarUrl: u.attributes?.picture?.[0] || '',
      })) || [],
    [usersData],
  );

  const visibleUsers = users.slice(0, 6);
  const remainingCount = users.length - visibleUsers.length;

  const handleAvatarClick = (userId: string, userName: string) => {
    if (selectedUser === userId) {
      onSearchClick('');
    } else {
      onSearchClick(userName);
    }
    setSelectedUser((prev) => (prev === userId ? null : userId));
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  return (
    <Box component="div" display="flex" alignItems="center">
      {visibleUsers.map((user, index) => (
        <Tooltip key={user.id} title={user.name}>
          <Avatar
            alt={user.name}
            src={user.avatarUrl}
            sx={{
              width: 32,
              height: 32,
              border:
                selectedUser === user.id
                  ? `2px solid ${theme.palette.primary.light}`
                  : `2px solid ${theme.palette.neutralVariant.icon}`,
              marginLeft: index === 0 ? 0 : '-6px',
              cursor: 'pointer',
              zIndex: selectedUser === user.id ? 10 : visibleUsers.length - index,
              transition: 'all 0.2s ease-in-out',
              fontSize: '0.75rem',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
            onClick={() => handleAvatarClick(user.id, user.name)}
          >
            {!user.avatarUrl && getInitials(user.name)}
          </Avatar>
        </Tooltip>
      ))}
      {remainingCount > 0 && (
        <Avatar
          sx={{
            width: 32,
            height: 32,
            cursor: 'pointer',
            bgcolor: theme.palette.info.main,
            fontSize: '0.75rem',
            transition: 'all 0.2s ease-in-out',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}
          onClick={handleMenuOpen}
        >
          +{remainingCount}
        </Avatar>
      )}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        aria-hidden={false}
      >
        {users.slice(6).map((user) => (
          <MenuItem key={user.id} onClick={() => handleAvatarClick(user.id, user.name)}>
            <Avatar
              alt={user.name}
              src={user.avatarUrl}
              sx={{
                width: 32,
                height: 32,
                marginRight: 1,
                border:
                  selectedUser === user.id
                    ? `2px solid ${theme.palette.primary.light}`
                    : `2px solid ${theme.palette.neutralVariant.icon}`,
                transition: 'border-color 0.2s ease-in-out',
              }}
            />
            {user.name}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
