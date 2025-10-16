import { Components, Theme } from '@mui/material';

export const MuiListItemButton: Components<Theme>['MuiListItemButton'] = {
  styleOverrides: {
    root: ({ theme, ownerState: { selected } }) => ({
      ...(selected && {
        color: theme.palette.primary.main,
        '& .MuiListItemIcon-root .MuiSvgIcon-root': {
          color: theme.palette.primary.main,
        },
      }),
      '& .MuiListItemIcon-root': {
        minWidth: 'unset',
        marginRight: '10px',
      },
    }),
  },
};
