import styled from '@emotion/styled';
import MuiTableContainer from '@mui/material/TableContainer';
import {
  alpha,
  Box,
  TableCell as MuiTableCell,
  Toolbar as MuiToolbar,
  TableRow as MuiTableRow,
} from '@mui/material';

export const TableWrapper = styled(Box)`
  label: TableWrapper;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const TableContainer = styled(MuiTableContainer)`
  label: TableContainer;
  flex: 1;
  overflow: auto;

  ::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
`;

export const TableCell = styled(MuiTableCell)`
  border-bottom: none;
  padding: 0.625rem 1.25rem;
  line-height: 17px;
`;

export const TableHeadCell = styled(MuiTableCell)`
  border-bottom: none;
  padding: 0.625rem 1.25rem;
  font-weight: 600;
  line-height: 17px;
  background-color: ${({ theme }) =>
    theme.palette.mode === 'light'
      ? theme.palette.common.white
      : alpha(theme.palette.neutral.surfaceContainer, 1)};

  .MuiTableSortLabel-root {
    &:hover,
    &:focus,
    &:active {
      color: inherit;

      .MuiTableSortLabel-icon {
        color: inherit;
        opacity: 1;
      }
    }

    .MuiTableSortLabel-icon {
      color: inherit;
      width: 1.5rem;
      height: unset;
    }
  }
`;

export const TableRow = styled(MuiTableRow)`
  transition: background 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    background: ${(props) => alpha(props.theme.palette.neutral.surfaceContainer, 1)};
  }

  &:nth-of-type(2n) {
    background: ${(props) => alpha(props.theme.palette.neutral.surfaceContainer, 0.4)};

    &:hover {
      background: ${(props) => alpha(props.theme.palette.neutral.surfaceContainer, 1)};
    }
  }
`;

export const TableToolbarContainer = styled(MuiToolbar)`
  label: TableToolbar;
  min-height: unset;
  justify-content: space-between;
`;

export const LoadingContainer = styled(Box)`
  label: LoadingContainer;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
