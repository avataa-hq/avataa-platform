import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const TaskEditStyled = styled(Box)`
  width: 100%;
  height: 80vh;
  display: flex;
`;

export const LeftArea = styled.div`
  flex: 1;
  height: 100%;
  width: 70%;
  padding: 10px;
  overflow-y: auto;
  min-width: 150px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const RightArea = styled.div`
  height: 100%;
  width: 30%;
  min-width: 300px;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  overflow-y: auto;
  border-left: 1px solid ${({ theme }) => theme.palette.neutralVariant.outline};
`;
