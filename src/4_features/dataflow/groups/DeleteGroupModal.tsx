import { Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { Modal, useTranslate } from '6_shared';
import { Group } from '6_shared/api/dataflowV3/types';
import { useDeleteGroup } from './api';

interface DeleteGroupModalProps {
  selectedGroup?: Group;
  onClose: () => void;
  open: boolean;
}

export const DeleteGroupModal = ({ onClose, open, selectedGroup }: DeleteGroupModalProps) => {
  const translate = useTranslate();

  const [deleteGroup, { isLoading: isDeleteGroupLoading }] = useDeleteGroup();

  const closeModal = () => {
    onClose();
  };

  const confirm = async () => {
    await deleteGroup(selectedGroup?.id);
    closeModal();
  };

  return (
    <Modal
      onClose={closeModal}
      open={open}
      title={translate('Delete')}
      minWidth={450}
      actions={
        <>
          <Button variant="contained" onClick={closeModal}>
            {translate('Cancel')}
          </Button>
          <LoadingButton
            variant="outlined"
            color="error"
            onClick={confirm}
            loading={isDeleteGroupLoading}
          >
            {translate('Confirm')}
          </LoadingButton>
        </>
      }
    >
      {`${translate('Are you sure you want to delete')} ${selectedGroup?.name}?`}
    </Modal>
  );
};
