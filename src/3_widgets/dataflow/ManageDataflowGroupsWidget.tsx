import { useCallback, useState } from 'react';
import { Box, Button, ListItemIcon, ListItemText } from '@mui/material';
import { AddRounded, CollectionsRounded, DeleteRounded, EditRounded } from '@mui/icons-material';

import { Modal, useTranslate, dataflowGroupsApi, useSetState, ErrorPage } from '6_shared';
import { Group } from '6_shared/api/dataflowV3/types';

import {
  ListItemButton,
  ListItemButtonActions,
} from '6_shared/ui/itemTreeList/ui/ItemTreeList.styled';
import { CreateGroupModal } from '4_features/dataflow/groups/CreateGroupModal';
import { EditGroupModal } from '4_features/dataflow/groups/EditGroupModal';
import { DeleteGroupModal } from '4_features/dataflow/groups/DeleteGroupModal';

const { useGetAllGroupsQuery } = dataflowGroupsApi;

interface ManageGroupsWidgetProps {
  onClose: () => void;
  open: boolean;
}

const defaultModalState = {
  edit: false,
  create: false,
  delete: false,
};

export const ManageDataflowGroupsWidget = ({ onClose, open }: ManageGroupsWidgetProps) => {
  const translate = useTranslate();
  const [selectedGroup, setSelectedGroup] = useState<Group | undefined>(undefined);
  const [modalState, setModalState] = useSetState(defaultModalState);

  const { data: groups, isError: isGroupsError } = useGetAllGroupsQuery();

  const close = () => {
    onClose();
  };

  const openEditGroupModal = useCallback(
    (group: Group) => {
      setSelectedGroup(group);
      setModalState({ edit: true });
    },
    [setModalState],
  );

  const openDeleteGroupModal = useCallback(
    (group: Group) => {
      setSelectedGroup(group);
      setModalState({ delete: true });
    },
    [setModalState],
  );

  return (
    <>
      <Modal
        onClose={close}
        open={open}
        title={translate('Groups')}
        minWidth={300}
        ModalContentSx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
        actions={
          <Button variant="contained" onClick={close}>
            {translate('Accept')}
          </Button>
        }
      >
        <Button variant="outlined.icon" onClick={() => setModalState({ create: true })}>
          <AddRounded /> {` ${translate('Create group')}`}
        </Button>
        <Box component="div" overflow="auto" flex={1}>
          {isGroupsError && (
            <ErrorPage
              error={{ message: translate('An error has occurred, please try again'), code: '404' }}
            />
          )}
          {!isGroupsError &&
            groups &&
            groups?.map((group) => (
              <ListItemButton key={group.id}>
                <ListItemIcon>
                  <CollectionsRounded />
                </ListItemIcon>
                <ListItemText>{group.name}</ListItemText>
                <ListItemButtonActions
                  component="div"
                  onClick={(event) => event.stopPropagation()}
                  onMouseDown={(event) => event.stopPropagation()}
                >
                  <EditRounded onClick={() => openEditGroupModal(group)} />
                  <DeleteRounded onClick={() => openDeleteGroupModal(group)} />
                </ListItemButtonActions>
              </ListItemButton>
            ))}
        </Box>
      </Modal>
      <CreateGroupModal onClose={() => setModalState({ create: false })} open={modalState.create} />
      <EditGroupModal
        selectedGroup={selectedGroup}
        onClose={() => setModalState({ edit: false })}
        open={modalState.edit}
      />
      <DeleteGroupModal
        selectedGroup={selectedGroup}
        onClose={() => setModalState({ delete: false })}
        open={modalState.delete}
      />
    </>
  );
};
