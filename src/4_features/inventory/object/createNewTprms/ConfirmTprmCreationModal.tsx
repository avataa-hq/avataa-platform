import { useState } from 'react';
import { Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { Modal, UpdateBatchOfParamTypesCheckResponse, useTranslate } from '6_shared';

interface ConfirmTprmCreationModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onClose: () => void;
  data?: UpdateBatchOfParamTypesCheckResponse;
  onConfirm: () => void | Promise<void>;
}

export const ConfirmTprmCreationModal = ({
  isOpen,
  onCancel,
  onClose,
  data,
  onConfirm,
}: ConfirmTprmCreationModalProps) => {
  const translate = useTranslate();
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);

  const closeModal = () => {
    onCancel();
  };

  const handleConfirm = async () => {
    closeModal();

    setIsConfirmLoading(true);
    await onConfirm();
    setIsConfirmLoading(false);
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => onClose()}
      title={translate('Info')}
      minWidth={500}
      hideBackdrop
      actions={
        <>
          <Button variant="outlined" onClick={() => closeModal()}>
            {translate('Cancel')}
          </Button>
          <LoadingButton loading={isConfirmLoading} variant="contained" onClick={handleConfirm}>
            {translate('Confirm')}
          </LoadingButton>
        </>
      }
    >
      <div>
        {translate('Columns will be updated:')} {` ${data?.will_be_updated}`}
      </div>
      <div>
        {translate('Columns will be created:')} {` ${data?.will_be_created}`}
      </div>
    </Modal>
  );
};
