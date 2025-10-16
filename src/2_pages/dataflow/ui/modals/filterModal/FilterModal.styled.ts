import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const ModalContent = styled(Box)`
  position: relative;
  min-width: 500px;
  width: 45%;
  padding: 20px;
  background: ${({ theme }) => theme.palette.background.default};
  border-radius: 10px;
`;

export const Header = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
