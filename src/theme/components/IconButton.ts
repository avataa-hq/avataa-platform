import { Components, Theme } from '@mui/material';

export const MuiIconButton: Components<Theme>['MuiIconButton'] = {
  styleOverrides: {
    root: ({ theme, ownerState }) => ({
      '& .MuiSvgIcon-root': {
        ...((!ownerState.color || ownerState.color === 'default') && {
          color: theme.palette.neutralVariant.icon,
        }),
      },
    }),
  },
};
