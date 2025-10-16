import { Components, Theme, alpha } from '@mui/material';

export const MuiAutocomplete: Components<Theme>['MuiAutocomplete'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      '& .MuiChip-filled': {
        color: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
      },
    }),
  },
  defaultProps: {
    ChipProps: {
      color: 'primary',
      variant: 'filled',
      sx: {
        '& .MuiSvgIcon-root': {
          color: (theme) => theme.palette.primary.main,
          '&:hover': {
            color: (theme) => theme.palette.primary.dark,
          },
        },
      },
    },
  },
};
