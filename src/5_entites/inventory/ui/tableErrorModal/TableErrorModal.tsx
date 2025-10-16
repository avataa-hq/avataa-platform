import { Box, Modal, useTranslate } from '6_shared';
import { ErrorModalCloseButton } from './TableErrorModal.styled';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export const TableErrorModal = ({ isOpen, onClose, message }: IProps) => {
  const translate = useTranslate();
  return (
    <Modal open={isOpen} onClose={onClose} title="Error!" width="40%" height="20%">
      <Box>{message}</Box>
      <ErrorModalCloseButton color="primary" onClick={onClose}>
        {translate('Close')}
      </ErrorModalCloseButton>
    </Modal>
  );
};
