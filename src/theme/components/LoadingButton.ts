import { Components, Theme } from '@mui/material';

export const MuiLoadingButton: Components<Theme>['MuiLoadingButton'] = {
  styleOverrides: {
    root: ({ ownerState: { loading } }) => ({
      ...(loading && {
        '& *': { visibility: 'hidden' },
        '& .MuiLoadingButton-loadingIndicator, & .MuiLoadingButton-loadingIndicator *': {
          visibility: 'visible',
        },
      }),
    }),
  },
  variants: [
    {
      props: { variant: 'contained.icon' },
      style: ({ theme }) => ({
        backgroundColor: (theme as Theme).palette.action.disabled,
      }),
    },
  ],
};
