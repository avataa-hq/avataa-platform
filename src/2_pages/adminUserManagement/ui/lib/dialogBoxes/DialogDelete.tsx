import { Button } from '@mui/material';
import { getItemType, getItemName } from '2_pages/adminUserManagement/utilities/utilities';
import {
  Modal,
  useTranslate,
  keycloakGroupsApi,
  keycloakRolesApi,
  keycloakUsersApi,
  useUserManagement,
  ItemType,
} from '6_shared';

const { useDeleteGroupMutation, useDeleteGroupRolesMutation } = keycloakGroupsApi;
const { useDeleteRoleMutation } = keycloakRolesApi;
const { useDeleteUserMutation, useDeleteUserFromGroupMutation, useDeleteUserRolesMutation } =
  keycloakUsersApi;

export const DialogDelete = () => {
  const translate = useTranslate();

  const {
    users,
    groups,
    roles,
    relatedItem,
    selectedObject,
    selectedUser,
    selectedGroup,
    selectedRole,
    isDialogDeleteOpen,
    setIsDialogDeleteOpen,
    setSelectedUser,
    setSelectedGroup,
    setSelectedRole,
  } = useUserManagement();

  const itemType = getItemType(selectedObject);

  let item: ItemType = selectedUser;
  if (itemType === 'group') item = selectedGroup;
  if (itemType === 'role') item = selectedRole;
  const itemName = getItemName(item);
  const itemId = item.id;

  const relatedItemObject = relatedItem[0] ?? {};
  const relatedItemName = getItemName(relatedItemObject);
  const relatedItemType = relatedItem[1] ?? '';

  const dialogText = `Delete${
    relatedItemName ? ` ${relatedItemName} ${relatedItemType} from the` : ''
  } ${itemType} ${itemName}?`;

  const [deleteUser] = useDeleteUserMutation();
  const [deleteGroup] = useDeleteGroupMutation();
  const [deleteRole] = useDeleteRoleMutation();
  const [deleteUserFromGroup] = useDeleteUserFromGroupMutation();
  const [deleteRoleFromGroup] = useDeleteGroupRolesMutation();
  const [deleteUserRole] = useDeleteUserRolesMutation();

  const onDeleteApply = () => {
    if (itemType === 'user') {
      if (relatedItemType === '') {
        deleteUser(itemId!);
        setSelectedUser(users[0]);
      }
      if (relatedItemType === 'group') deleteUserFromGroup([itemId!, relatedItem[0].id!]);
      if (relatedItemType === 'role') deleteUserRole([itemId!, [relatedItem[0]!]]);
    }

    if (itemType === 'group') {
      if (relatedItemType === '') {
        deleteGroup(itemId!);
        setSelectedGroup(groups[0]);
      }
      if (relatedItemType === 'user') deleteUserFromGroup([relatedItem[0].id!, itemId!]);
      if (relatedItemType === 'role') deleteRoleFromGroup([itemId!, [relatedItem[0]!]]);
    }

    if (itemType === 'role') {
      if (relatedItemType === '') {
        deleteRole(itemName!);
        setSelectedRole(roles[0]);
      }
      if (relatedItemType === 'user') {
        deleteUserRole([relatedItem[0].id!, [item!]]);
      }
      if (relatedItemType === 'group') {
        deleteRoleFromGroup([relatedItem[0].id!, [item!]]);
      }
    }

    setIsDialogDeleteOpen(false);
  };

  const onDeleteCancel = () => {
    setIsDialogDeleteOpen(false);
  };

  return (
    <Modal
      open={isDialogDeleteOpen}
      onClose={onDeleteCancel}
      title={dialogText}
      minWidth="30%"
      actions={
        <>
          <Button variant="outlined" className="btn" onClick={onDeleteCancel}>
            {translate('Back')}
          </Button>
          <Button variant="outlined" className="btn" onClick={onDeleteApply}>
            {translate('Delete')}
          </Button>
        </>
      }
    />
  );
};
