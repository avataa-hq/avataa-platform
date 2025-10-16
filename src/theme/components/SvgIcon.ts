import { Components, Theme } from '@mui/material';

import { getBubbleSvgIconStyle } from '../utils';

export const MuiSvgIcon: Components<Theme>['MuiSvgIcon'] = {
  styleOverrides: {
    root: ({ theme, ownerState }) => ({
      ...((!ownerState.color || ownerState.color === 'inherit') && {
        color: theme.palette.text.primary,
      }),
      ...(ownerState.variant === 'bubble' && getBubbleSvgIconStyle(theme, ownerState).style),
    }),
  },
  variants: [
    {
      props: { variant: 'bubble' },
      style: () => ({
        height: '30px',
        width: '30px',
        fontSize: 'unset',
        borderRadius: '50%',
        padding: '5px',
      }),
    },
  ],
};
