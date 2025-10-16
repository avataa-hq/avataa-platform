import styled from '@emotion/styled';
import { Box, alpha } from '@mui/material';

export const KanbanBoardColumnStyled = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 240px;
  background-color: ${({ theme }) => alpha(theme.palette.primary.main, 0.1)};
  padding: 5px;
`;

export const ColumnBody = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 10px;
  padding-bottom: 20px;
  flex-grow: 1;
`;
