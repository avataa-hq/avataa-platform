import { Components, Theme } from '@mui/material';

export const MuiOutlinedInput: Components<Theme>['MuiOutlinedInput'] = {
  styleOverrides: {
    notchedOutline: ({ theme }) => ({
      borderColor: theme.palette.neutralVariant.outline,
    }),
  },
};
