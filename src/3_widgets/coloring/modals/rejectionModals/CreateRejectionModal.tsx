import { Typography, Button } from '@mui/material';
import { Modal } from '6_shared';

interface IProps {
  isOpenCreateForbiddenModal?: boolean;
  onCloseCreateRejection?: () => void;
  disablePortal?: boolean;
}

export const CreateRejectionModal = ({
  isOpenCreateForbiddenModal,
  onCloseCreateRejection,
  disablePortal,
}: IProps) => {
  return (
    <Modal
      disablePortal={disablePortal}
      open={isOpenCreateForbiddenModal ?? false}
      onClose={() => onCloseCreateRejection?.()}
      minWidth="30%"
      actions={
        <Button onClick={onCloseCreateRejection} variant="contained" size="medium">
          OK
        </Button>
      }
    >
      <Typography>Please select a Parameter first</Typography>
    </Modal>
  );
};
