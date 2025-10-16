import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const MessageContainer = styled(Box)`
  display: flex;
  gap: 10px;
  border-radius: 10px;
  padding: 10px;
  margin: 20px;
  box-shadow: ${({ theme }) => `-8px 7px 10px -6px ${theme.palette.secondary.main}`};
`;

export const IconContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
`;
