import { Components, Theme } from '@mui/material';

export const MuiTabPanel: Components<Theme>['MuiTabPanel'] = {
  styleOverrides: {
    root: {
      padding: 0,
      overflow: 'hidden',
      width: '100%',
      height: '100%',
      // '&.simple': {
      minHeight: '38px',
      // },
    },
  },
};
