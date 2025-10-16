import styled from '@emotion/styled';
import { Box, Modal } from '@mui/material';

export const ConfirmationModalStyled = styled(Modal)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Content = styled(Box)`
  min-width: 10%;
  max-width: 400px;
  padding: 20px;
  background: ${({ theme }) => theme.palette.background.default};
  box-shadow: 0 5px 12px 6px rgba(0, 0, 0, 0.32);
  border-radius: 20px;
  outline: none;
`;

export const Header = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  width: 100%;
`;
export const Body = styled(Box)`
  text-align: center;
  margin-bottom: 10px;
`;
export const Footer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
`;
