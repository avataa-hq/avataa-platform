import { Typography, Button } from '@mui/material';
import { Modal, useTranslate } from '6_shared';

interface IProps {
  isOpenUpdateRejectionModal?: boolean;
  onCloseUpdateRejection?: () => void;
  disablePortal: boolean;
}

export const UpdateRejectionModal = ({
  isOpenUpdateRejectionModal,
  onCloseUpdateRejection,
  disablePortal,
}: IProps) => {
  const translate = useTranslate();

  return (
    <Modal
      open={isOpenUpdateRejectionModal ?? false}
      onClose={() => onCloseUpdateRejection}
      minWidth="30%"
      disablePortal={disablePortal}
      actions={
        <Button onClick={onCloseUpdateRejection} variant="contained" size="medium">
          {translate('OK')}
        </Button>
      }
    >
      <Typography>
        {translate(
          'This colouring setting is set to global default. You must first set an other colouring setting to be default.',
        )}
      </Typography>
    </Modal>
  );
};
