import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const InventoryPageContainer = styled(Box)`
  display: flex;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.palette.neutral.surface};
`;

export const TableBody = styled(Box)`
  width: 100%;
  height: calc(100% - 60px);
  display: flex;
  /* margin-top: 20px; */
`;

export const TableWrapper = styled(Box)`
  width: 100%;
  min-width: 0;
  background-color: ${({ theme }) =>
    theme.palette.mode === 'light'
      ? theme.palette.background.default
      : theme.palette.background.paper};
  border-radius: 10px;
`;
