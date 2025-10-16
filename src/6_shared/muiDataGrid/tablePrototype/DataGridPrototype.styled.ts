import { DataGridPremium } from '@mui/x-data-grid-premium';
import styled from '@emotion/styled';
import { Box } from '@mui/system';

import { DATA_GRID_ROW_HEIGHT } from '../model';

interface ICheckboxSelection {
  isCheckBoxRowSelection?: boolean;
}

export const StyledDataGrid = styled(DataGridPremium, {
  shouldForwardProp: (propName) => propName !== 'isCheckBoxRowSelection',
})<ICheckboxSelection>`
  overflow: visible !important;
  width: 100%;
  /* height: 95%; */
  height: 100%;
  border: none;
  padding: 5px;

  & ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    background-color: ${({ theme }) => theme.palette.background.default};
  }

  & ::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.palette.neutralVariant.icon};
  }

  .MuiDataGrid-columnHeaderTitle {
    font-weight: 600;
  }

  .MuiDataGrid-cell {
    border: none;
    display: flex;
    align-items: center;

    :focus {
      height: ${DATA_GRID_ROW_HEIGHT - 2}px;
    }
  }

  .MuiDataGrid-footerContainer {
    padding: 10px 0;
  }

  .MuiDataGrid-selectedRowCount {
    margin: 0 0 0 15px;
  }

  .MuiDataGrid-row {
    border-radius: 5px;
  }

  .MuiDataGrid-row:hover {
    background-color: ${({ theme }) => theme.palette.neutral.surface};
  }

  & .row-even {
    &:hover {
      background: ${(props) => props.theme.palette.neutral.surface};
    }
  }

  & .row-odd {
    background: ${(props) => props.theme.palette.neutral.surfaceContainerLow};

    &:hover {
      background: ${(props) => props.theme.palette.neutral.surface};
    }
  }
`;

export const Loader = styled(Box)`
  background-color: ${({ theme }) => theme.palette.neutral.surface};
  opacity: 0.7;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border: none;
  padding: 5px;
  z-index: 10;
`;
