import { useTheme } from '@mui/material';
import { WarningRounded } from '@mui/icons-material';
import { Modal, useTranslate } from '6_shared';
import { ModalBody, ModalButton, ModalHeader, ModalTitle } from './ConfirmActionModal.styled';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmActionClick: () => void;
  title?: string;
  confirmationButtonText?: string;
  withWarningIcon?: boolean;
  width?: number;
  height?: number;
}

export const ConfirmActionModal = ({
  isOpen,
  onClose,
  onConfirmActionClick,
  title,
  confirmationButtonText,
  withWarningIcon = false,
  width = 350,
  height,
}: IProps) => {
  const theme = useTheme();
  const translate = useTranslate();
  return (
    <Modal open={isOpen} onClose={onClose} width={width} height={height}>
      <ModalHeader>
        {withWarningIcon && (
          <WarningRounded
            sx={{ fill: theme.palette.warning.main, width: '35px', height: '35px' }}
          />
        )}
        <ModalTitle>{title}</ModalTitle>
      </ModalHeader>

      <ModalBody>
        <ModalButton variant="outlined" onClick={onClose}>
          {translate('Cancel')}
        </ModalButton>
        <ModalButton variant="contained" onClick={onConfirmActionClick}>
          {confirmationButtonText || translate('Save')}
        </ModalButton>
      </ModalBody>
    </Modal>
  );
};
