import { Components, Theme } from '@mui/material';

export const MuiButton: Components<Theme>['MuiButton'] = {
  styleOverrides: {
    root: {
      textTransform: 'none',
      fontFamily: 'inherit',
      fontWeight: 600,
      textSizeMedium: 14,
      textSizeLarge: 16,
      textSizeSmall: 12,
      lineHeight: 'unset',
      borderRadius: 50,
      transition: 'all 300ms',
      padding: '10px 20px',
      ':hover': {
        transform: 'scale(101%)',
      },
      ':active': {
        transform: 'scale(99%)',
      },
    },
    contained: ({ theme, ownerState: { color } }) => ({
      '.MuiSvgIcon-root': {
        ...(color &&
          color !== 'inherit' &&
          theme.palette.hasOwnProperty(color) && { color: theme.palette[color].contrastText }),
      },
    }),
    text: ({ theme, ownerState: { color } }) => ({
      '.MuiSvgIcon-root': {
        ...(color &&
          color !== 'inherit' &&
          theme.palette.hasOwnProperty(color) && { color: theme.palette[color].main }),
      },
    }),
    outlined: ({ theme, ownerState: { color, disabled } }) => ({
      '.MuiSvgIcon-root': {
        ...(color &&
          color !== 'inherit' &&
          theme.palette.hasOwnProperty(color) && { color: theme.palette[color].main }),

        ...(disabled && {
          color: theme.palette.text.disabled,
        }),
      },
    }),
    disabled: ({ theme }) => ({
      fill: theme.palette.text.disabled,
    }),
  },
  variants: [
    {
      props: { variant: 'contained.icon' },
      style: ({ theme }) => ({
        minWidth: 'unset',
        borderRadius: '0.652rem',
        padding: '10px',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,

        '&:hover, &:active': {
          transform: 'unset',
          backgroundColor: theme.palette.primary.dark,
        },

        '.MuiSvgIcon-root': {
          fill: theme.palette.primary.contrastText,
          color: theme.palette.primary.contrastText,
        },
      }),
    },
    {
      props: { variant: 'outlined.icon' },
      style: ({ theme }) => ({
        minWidth: 'unset',
        borderRadius: '0.652rem',
        padding: '10px',

        '&:hover, &:active': {
          transform: 'unset',
        },

        border: `1px solid ${theme.palette.neutralVariant.outline}`,
        backgroundColor: theme.palette.neutral.surfaceContainerLowestVariant2,

        '.MuiSvgIcon-root': {
          fill: 'currentColor',
          color: 'inherit',
        },
      }),
    },
  ],
};
