import { Components, Theme } from '@mui/material';

export const MuiTextField: Components<Theme>['MuiTextField'] = {
  styleOverrides: {
    root: () => ({
      color: 'inherit',

      '.MuiInputBase-root': {
        borderRadius: '10px',
        color: 'inherit',
      },
    }),
  },
  defaultProps: {
    variant: 'outlined',
    size: 'small',
    InputLabelProps: {
      disableAnimation: true,
      shrink: false,
      sx: {
        color: 'inherit',
        transform: 'unset',
        position: 'unset',
        lineHeight: '1.125rem',
        mb: '0.625rem',
      },
    },
  },
};
