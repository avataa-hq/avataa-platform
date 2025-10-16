import styled from '@emotion/styled';
import { TableHead, TableBody, alpha } from '@mui/material';

export const TableBodyStyled = styled(TableBody)`
  & tr:nth-of-type(4n + 3) {
    background-color: ${({ theme }) => alpha(theme.palette.neutralVariant.outline, 0.5)};
  }
`;

export const TableHeadStyled = styled(TableHead)`
  background-color: ${({ theme }) => alpha(theme.palette.neutralVariant.outline, 0.5)};
`;
