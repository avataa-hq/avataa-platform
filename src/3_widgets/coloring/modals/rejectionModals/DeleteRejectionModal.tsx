import { Typography, Button } from '@mui/material';
import { Modal } from '6_shared';

interface IProps {
  isOpenDeleteForbiddenModal?: [boolean, string];
  onCloseDeleteRejection?: () => void;
  disablePortal: boolean;
}

export const DeleteRejectionModal = ({
  isOpenDeleteForbiddenModal,
  onCloseDeleteRejection,
  disablePortal,
}: IProps) => {
  const popupText: { [key: string]: string } = {
    '': 'You have no rights to delete this colouring setting',
    'public default':
      'This colouring setting is set to global default, you are not allowed to delete it. You must first set an other colouring setting to be default.',
    'other user':
      'This colouring setting is created by an other user. You have no rights to delete it',
  };

  return (
    <Modal
      open={isOpenDeleteForbiddenModal?.[0] ?? false}
      onClose={() => onCloseDeleteRejection?.()}
      minWidth="30%"
      disablePortal={disablePortal}
      actions={
        <Button onClick={onCloseDeleteRejection} variant="contained" size="medium">
          OK
        </Button>
      }
    >
      <Typography>{popupText[isOpenDeleteForbiddenModal?.[1] ?? '']}</Typography>
    </Modal>
  );
};
