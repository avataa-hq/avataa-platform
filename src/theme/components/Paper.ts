import { Components, Theme } from '@mui/material';

export const MuiPaper: Components<Theme>['MuiPaper'] = {
  styleOverrides: {
    root: {
      backdropFilter: 'blur(50px)',
    },
  },
};
