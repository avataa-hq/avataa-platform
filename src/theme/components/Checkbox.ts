import { Components, Theme } from '@mui/material';

export const MuiCheckbox: Components<Theme>['MuiCheckbox'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      color: theme.palette.info.main,
      '.MuiSvgIcon-root': {
        color: 'inherit',
      },
    }),
    checked: ({ theme }) => ({
      color: theme.palette.primary.main,
    }),
    disabled: ({ theme }) => ({
      color: theme.palette.action.disabled,
    }),
  },
};
