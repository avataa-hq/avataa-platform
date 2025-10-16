import { Components, Theme } from '@mui/material';

export const MuiDataGrid: Components<Theme>['MuiDataGrid'] = {
  defaultProps: {
    slotProps: {
      baseTextField: {
        variant: 'outlined',
      },
      baseSelect: {
        variant: 'outlined',
      },
    },
  },
  styleOverrides: {
    filterFormLogicOperatorInput: {
      br: '10px',
    },
    filterForm: {
      display: 'flex',
      gap: '5px',
    },
    virtualScroller: {
      '&::-webkit-scrollbar': {
        width: '5px',
        height: '5px',
      },
    },
  },
};

// .MuiDataGrid-virtualScroller::-webkit-scrollbar {
//   width: 5px;
//   height: 5px;
// }
