import styled from '@emotion/styled';
import { Box, Button, Typography } from '@mui/material';

export const ModalHeader = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 1.25rem;
  width: 224px;
  margin-left: auto;
  margin-right: auto;
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
