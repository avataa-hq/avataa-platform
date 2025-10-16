import { Button, Typography } from '@mui/material';
import { Modal, useBatchImport, useTranslate } from '6_shared';
import { useEffect } from 'react';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmIfErrorModal = ({ isOpen, onClose, onConfirm }: IProps) => {
  const translate = useTranslate();

  const { isForcedFileSend, setIsForcedFileSend } = useBatchImport();

  const onConfirmClick = () => {
    setIsForcedFileSend(true);
  };

  useEffect(() => {
    if (isForcedFileSend && isOpen) onConfirm();
  }, [isForcedFileSend, onConfirm, isOpen]);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={translate('File contains errors.')}
      width="300px"
      height="250px"
      ModalContentSx={{
        overflow: 'auto',
        height: '100%',
      }}
      actions={
        <>
          <Button onClick={onClose} variant="contained" color="primary">
            {translate('Cancel')}
          </Button>
          <Button onClick={onConfirmClick} variant="contained" color="primary">
            {translate('Confirm')}
          </Button>
        </>
      }
    >
      <Typography>
        {translate(
          'Only valid object parameters will be taken into account during the import process. Do you want to continue?',
        )}
      </Typography>
    </Modal>
  );
};
