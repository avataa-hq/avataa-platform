import { Typography, Button } from '@mui/material';
import { Modal, useTranslate } from '6_shared';

interface IProps {
  onDeleteClick?: () => Promise<void>;
  isOpenDeleteConfirmationModal: boolean;
  setIsOpenDeleteConfirmationModal: (isOpen: boolean) => void;
  disablePortal: boolean;
}

export const DeleteConfirmationModal = ({
  onDeleteClick,
  isOpenDeleteConfirmationModal,
  setIsOpenDeleteConfirmationModal,
  disablePortal,
}: IProps) => {
  const translate = useTranslate();

  const handleClose = () => setIsOpenDeleteConfirmationModal(false);

  return (
    <Modal
      open={isOpenDeleteConfirmationModal}
      onClose={handleClose}
      minWidth="30%"
      disablePortal={disablePortal}
      actions={
        <>
          <Button onClick={handleClose} variant="outlined" size="medium">
            {translate('Cancel')}
          </Button>
          <Button onClick={onDeleteClick} variant="contained" size="medium">
            {translate('Delete')}
          </Button>
        </>
      }
    >
      <Typography textAlign="center" fontSize="18px">
        {translate('Do you really want to delete this colour setting?')}
      </Typography>
    </Modal>
  );
};
