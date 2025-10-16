import { Components, Theme } from '@mui/material';

export const MuiTab: Components<Theme>['MuiTab'] = {
  styleOverrides: {
    root: {
      textTransform: 'none',
      '&.simple': {
        minWidth: '0',
        padding: '0',
        // marginRight: '0.6rem',
        // textTransform: 'none',
        fontWeight: '600',
        marginRight: '0.6rem',
      },
    },
  },
};
