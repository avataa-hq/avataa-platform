import { Box } from '@mui/material';
import { ModalFooterContainer } from './Modal.styled';

export const ModalFooter = ({ children }: React.PropsWithChildren) => {
  return (
    <ModalFooterContainer>
      <Box component="div" sx={{ flex: 1 }} />
      {children}
    </ModalFooterContainer>
  );
};
