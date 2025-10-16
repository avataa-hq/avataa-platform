import { useCallback } from 'react';
import { Delete, Edit, Info } from '@mui/icons-material';
import { useTheme } from '@emotion/react';
import { IconButton } from '@mui/material';
import { Box, ItemType, useUserManagement } from '6_shared';
import { getItemName } from '../../utilities/utilities';

export const ItemActions = ({ item }: { item: ItemType }) => {
  const theme = useTheme();

  const {
    selectedObject,
    selectedUser,
    selectedGroup,
    selectedRole,
    setSelectedUser,
    setSelectedGroup,
    setSelectedRole,
    setIsDialogUserOpen,
    setUserDialogType,
    setIsDialogDeleteOpen,
    setRelatedItem,
  } = useUserManagement();

  const selectedItemId = useCallback(() => {
    switch (selectedObject) {
      case 'Users':
        return selectedUser.id;
      case 'Groups':
        return selectedGroup.id;
      case 'Roles':
        return selectedRole.id;
      default:
        return null;
    }
  }, [selectedObject, selectedUser, selectedGroup, selectedRole]);

  const dispatchSelectedItemAction = useCallback(() => {
    switch (selectedObject) {
      case 'Users':
        return setSelectedUser(item);
      case 'Groups':
        return setSelectedGroup(item);
      case 'Roles':
        return setSelectedRole(item);
      default:
        return null;
    }
  }, [selectedObject, item]);

  const dispatchOpenSelectedDialog = useCallback(
    (dialogType: string) => {
      switch (selectedObject) {
        case 'Users':
          switch (dialogType) {
            case 'info': {
              setUserDialogType('info');
              setSelectedUser(item);
              return setIsDialogUserOpen(true);
            }
            case 'edit': {
              setSelectedUser(item);
              setUserDialogType('edit');
              return setIsDialogUserOpen(true);
            }
            case 'delete': {
              setRelatedItem([{}, '']);
              return setIsDialogDeleteOpen(true);
            }
            default:
              return null;
          }
        case 'Groups':
          switch (dialogType) {
            case 'delete':
              setRelatedItem([{}, '']);
              return setIsDialogDeleteOpen(true);
            default:
              return null;
          }
        case 'Roles':
          switch (dialogType) {
            case 'delete':
              setRelatedItem([{}, '']);
              return setIsDialogDeleteOpen(true);
            default:
              return null;
          }
        default:
          return null;
      }
    },
    [selectedObject, item],
  );

  const isSelected = item.id === selectedItemId();
  const itemName = getItemName(item);

  return (
    <Box
      sx={{
        display: 'flex',
        opacity: isSelected ? 1 : 0.3,
        '&:hover': {
          opacity: isSelected ? 1 : 0.7,
        },
      }}
    >
      {selectedObject === 'Users' && (
        <>
          <IconButton
            size="small"
            onClick={() => {
              dispatchSelectedItemAction();
              dispatchOpenSelectedDialog('info');
            }}
            data-testid={itemName?.startsWith('at_') ? `${itemName}_info-btn` : undefined}
            sx={{
              '&:hover': {
                color: theme.palette.primary.main,
              },
            }}
          >
            <Info />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => {
              dispatchSelectedItemAction();
              dispatchOpenSelectedDialog('edit');
            }}
            data-testid={itemName?.startsWith('at_') ? `${itemName}_edit-btn` : undefined}
            sx={{
              '&:hover': {
                color: theme.palette.primary.main,
              },
            }}
          >
            <Edit />
          </IconButton>
        </>
      )}
      <IconButton
        size="small"
        onClick={() => {
          dispatchSelectedItemAction();
          dispatchOpenSelectedDialog('delete');
        }}
        data-testid={itemName?.startsWith('at_') ? `${itemName}_delete-btn` : undefined}
        sx={{
          '&:hover': {
            color: theme.palette.primary.main,
          },
          padding: 0,
        }}
      >
        <Delete />
      </IconButton>
    </Box>
  );
};
