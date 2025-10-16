import { useState } from 'react';
import { Button } from '@mui/material';
import {
  Modal,
  useTranslate,
  keycloakGroupsApi,
  keycloakUsersApi,
  handleApiAction,
  useUserManagement,
  ItemType,
} from '6_shared';
import { getItemType, getItemName } from '2_pages/adminUserManagement/utilities/utilities';
import { Multiselect } from './Multiselect';
import { sortList } from '../../helper';

const { useAddGroupRolesMutation } = keycloakGroupsApi;
const { useAddUserRolesMutation, useAddUserToGroupMutation } = keycloakUsersApi;

export const DialogAssign = () => {
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
    isDialogAssignOpen,
    setIsDialogAssignOpen,
  } = useUserManagement();

  const ITEM_ACCORDANCE = {
    user: selectedUser,
    group: selectedGroup,
    role: selectedRole,
  };

  const LIST_ACCORDANCE = {
    user: users,
    group: groups,
    role: roles,
  };

  const itemType = getItemType(selectedObject);
  const item = ITEM_ACCORDANCE[itemType as keyof typeof ITEM_ACCORDANCE];
  const itemName = getItemName(item);
  const itemId = item.id;

  const [relatedItemObjects, setRelatedItemObjects] = useState<ItemType[]>([]);
  const relatedItemType = relatedItem[1] ?? '';

  const listElements = LIST_ACCORDANCE[relatedItemType as keyof typeof LIST_ACCORDANCE];

  const dialogText = `${translate('Select')} ${relatedItemType}${translate('s')} ${translate(
    'to add to the',
  )} ${itemType} ${itemName}`;

  const [addUserToGroup] = useAddUserToGroupMutation();
  const [addUserRole] = useAddUserRolesMutation();
  const [addGroupRole] = useAddGroupRolesMutation();

  const onAssignApply = () => {
    if (itemType === 'user') {
      if (relatedItemType === 'group') {
        Promise.all(
          relatedItemObjects.map(async (relatedItemObject) =>
            handleApiAction(
              () => addUserToGroup([itemId!, relatedItemObject.id!]),
              `Group ${getItemName(relatedItemObject)} added successfully`,
            ),
          ),
        );
      }
      if (relatedItemType === 'role') {
        Promise.all(
          relatedItemObjects.map(async (relatedItemObject) =>
            handleApiAction(
              () => addUserRole([itemId!, [relatedItemObject]]),
              `Group ${getItemName(relatedItemObject)} added successfully`,
            ),
          ),
        );
      }
    }

    if (itemType === 'group') {
      if (relatedItemType === 'user') {
        Promise.all(
          relatedItemObjects.map(async (relatedItemObject) =>
            handleApiAction(
              () => addUserToGroup([relatedItemObject.id!, itemId!]),
              `User ${getItemName(relatedItemObject)} added successfully`,
            ),
          ),
        );
      }
      if (relatedItemType === 'role') {
        Promise.all(
          relatedItemObjects.map(async (relatedItemObject) =>
            handleApiAction(
              () => addGroupRole([itemId!, [relatedItemObject!]]),
              `Role ${getItemName(relatedItemObject)} added successfully`,
            ),
          ),
        );
      }
    }

    if (itemType === 'role') {
      if (relatedItemType === 'user') {
        Promise.all(
          relatedItemObjects.map(async (relatedItemObject) =>
            handleApiAction(
              () => addUserRole([relatedItemObject.id!, [item!]]),
              `User ${getItemName(relatedItemObject)} added successfully`,
            ),
          ),
        );
      }
      if (relatedItemType === 'group') {
        Promise.all(
          relatedItemObjects.map(async (relatedItemObject) =>
            handleApiAction(
              () => addGroupRole([relatedItemObject.id!, [item!]]),
              `Group ${getItemName(relatedItemObject)} added successfully`,
            ),
          ),
        );
      }
    }
    setRelatedItemObjects([]);
    setIsDialogAssignOpen(false);
  };

  const onAssignCancel = () => {
    setRelatedItemObjects([]);
    setIsDialogAssignOpen(false);
  };

  return (
    <Modal
      open={isDialogAssignOpen}
      onClose={onAssignCancel}
      title={dialogText}
      minWidth="30%"
      actions={
        <Button
          variant="outlined"
          className="create-btn"
          sx={{ mt: '10px' }}
          onClick={onAssignApply}
        >
          {translate('Add')}
        </Button>
      }
      ModalContentSx={{ overflow: 'visible' }}
    >
      <Multiselect
        listElements={sortList(listElements)}
        setRelatedItemObjects={setRelatedItemObjects}
      />
    </Modal>
  );
};

// TODO :: REPLACE THE IN THE COMPONENT
// const actionMappings: Record<
//     string,
//     Record<
//       string,
//       {
//         action: any;
//         message: (relatedItemObject: ItemType) => string;
//         args: (relatedItemObject: ItemType) => any[];
//       }
//     >
//   > = {
//     user: {
//       group: {
//         action: addUserToGroup,
//         message: (relatedItemObject) =>
//           `Group ${getItemName(relatedItemObject)} added successfully`,
//         args: (relatedItemObject) => [itemId, relatedItemObject.id],
//       },
//       role: {
//         action: addUserRole,
//         message: (relatedItemObject) =>
//           `Group ${getItemName(relatedItemObject)} added successfully`,
//         args: (relatedItemObject) => [itemId, [relatedItemObject]],
//       },
//     },
//     group: {
//       user: {
//         action: addUserToGroup,
//         message: (relatedItemObject) => `User ${getItemName(relatedItemObject)} added successfully`,
//         args: (relatedItemObject: ItemType) => [relatedItemObject.id, itemId],
//       },
//       role: {
//         action: addGroupRole,
//         message: (relatedItemObject) => `Role ${getItemName(relatedItemObject)} added successfully`,
//         args: (relatedItemObject) => [relatedItemObject.id, [itemId]],
//       },
//     },
//     role: {
//       user: {
//         action: addUserRole,
//         message: (relatedItemObject) => `User ${getItemName(relatedItemObject)} added successfully`,
//         args: (relatedItemObject) => [relatedItemObject.id, [item]],
//       },
//       group: {
//         action: addGroupRole,
//         message: (relatedItemObject) =>
//           `Group ${getItemName(relatedItemObject)} added successfully`,
//         args: (relatedItemObject) => [relatedItemObject.id, [item]],
//       },
//     },
//   };

//   const onAssignApply = () => {
//     const action = actionMappings[itemType]?.[relatedItemType]?.action;
//     const messageFunction = actionMappings[itemType]?.[relatedItemType]?.message;
//     const getArgs = actionMappings[itemType]?.[relatedItemType]?.args;

//     if (action && messageFunction && getArgs) {
//       Promise.all(
//         relatedItemObjects.map(async (relatedItemObject) =>
//           handleApiAction(
//             () => action(...getArgs(relatedItemObject)),
//             messageFunction(relatedItemObject),
//           ),
//         ),
//       );
//     }

//     setRelatedItemObjects([]);
//     setIsDialogAssignOpen(false);
//   };
