import styled from '@emotion/styled';
import { Box } from '6_shared';

export const TableContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 55%;
  overflow-y: auto;
  width: 100%;
`;

export const TableRow = styled(Box)`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const TableRowItem = styled(Box)`
  width: 20%;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TableRowItemName = styled(Box)`
  width: 40%;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
`;
