import styled from '@emotion/styled';
import { Box, Button, Typography } from '@mui/material';

export const DefaultCommentsStyled = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const Body = styled(Box)`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

export const Title = styled(Typography)`
  margin-bottom: 0.3125rem;
`;

export const Wrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

export const ModalHeader = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 0.3125rem;
  padding: 20px 30px;
`;

export const ModalBody = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3125rem;
`;

export const ModalTitle = styled(Typography)`
  font-size: 16px;
  text-align: center;
`;

export const ModalButton = styled(Button)`
  width: 150px;
  height: 37px;
`;
