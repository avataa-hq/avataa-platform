import styled from '@emotion/styled';
import { TableCell } from '@mui/material';
import { Box } from '@mui/system';

export const EvenstStyled = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const EvenstHeaderStyled = styled(Box)`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 0 20px 0 10px;
  align-items: flex-end;
`;

export const EvenstTablerStyled = styled(Box)``;

export const StyledTableCellHeader = styled(TableCell)`
  border-right: 1px solid #ccc;
  font-weight: bold;
  text-align: left;
  padding: 8px;
`;

export const StyledTableCell = styled(TableCell)`
  border-right: 1px solid #ccc;
  text-align: left;
  padding: 8px;
  font-size: 14px;
`;
