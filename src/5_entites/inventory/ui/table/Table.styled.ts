import { DataGridPremium } from '@mui/x-data-grid-premium';
import styled from '@emotion/styled';
import { Box } from '@mui/system';
import fileLight from 'assets/img/fileDark.svg';
import fileDark from 'assets/img/fileLight.svg';
import { Checkbox } from '@mui/material';

export interface ICheckboxSelection {
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

  .MuiDataGrid-columnHeader {
    padding: 0 10px;
  }

  .MuiDataGrid-cell {
    border: none;
    display: flex;
    align-items: center;
  }

  .MuiDataGrid-row {
    padding-left: ${(props) => (props.isCheckBoxRowSelection ? '5px' : '50px')};
  }

  .MuiDataGrid-columnHeaders {
    padding-left: ${(props) => (props.isCheckBoxRowSelection ? 0 : '50px')};
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
  & .has-file {
    position: relative;
    overflow: visible !important;
    &:before {
      content: url(${({ theme }) => (theme.palette.mode === 'dark' ? fileLight : fileDark)});
      display: block;
      width: 20px;
      height: 20px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 0;
    }
  }
`;
