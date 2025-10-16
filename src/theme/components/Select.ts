import { Components, Theme } from '@mui/material';

export const MuiSelect: Components<Theme>['MuiSelect'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      color: 'inherit',
      width: '100%',
      padding: '4px 14px 5px',
      borderRadius: '10px',
      height: '41px',
      backgroundColor: theme.palette.neutral.surfaceContainerLowestVariant2,
      transition: 'all 0.3s',

      '&.Mui-focused': {
        borderWidth: '1px',
      },
    }),
    icon: {
      color: 'inherit',
    },
    select: ({ theme, ownerState }) => ({
      ...(ownerState.value === 'none' && { color: theme.palette.text.secondary }),
      fontFamily: 'Mulish, sans-serif',
      fontWeight: 700,
    }),
  },
};
