import styled from '@emotion/styled';
import { DataGridPremium } from '@mui/x-data-grid-premium';

export const StyledDataGrid = styled(DataGridPremium)`
  overflow: visible !important;
  width: 100%;
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
  }

  .MuiDataGrid-footerContainer {
    padding: 10px 0;
  }

  .MuiDataGrid-selectedRowCount {
    margin: 0 0 0 15px;
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
