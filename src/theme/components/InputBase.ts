import { Components, Theme } from '@mui/material';

export const MuiInputBase: Components<Theme>['MuiInputBase'] = {
  styleOverrides: {
    root: () => ({
      // width: '100%',
      fontFamily: 'Mulish, sans-serif',
      fontWeight: 700,
      // fieldset: {
      //   borderColor: theme.palette.neutral.surfaceContainerLowestVariant2,
      // },
    }),
  },
};
