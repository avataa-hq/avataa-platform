import styled from '@emotion/styled';
import { Box, Button, Typography } from '@mui/material';

export const TraceStyled = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 20px;
`;

export const TraceHeader = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 0;
`;

export const TraceBody = styled(Box)`
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  flex-grow: 1;
  gap: 30px;
  width: 100%;
  overflow-y: auto;
  padding: 0 0.625rem;
`;

export const TraceFooter = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

export const ButtonStyled = styled(Button)`
  width: 120px;
  height: 38px;
  font-size: 12px;
`;

export const ButtonsWrapper = styled(Box)`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const LoadingContainer = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
