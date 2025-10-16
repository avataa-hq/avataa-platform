import '@emotion/react';
import '@mui/material/utils/createSvgIcon';
import { Theme as MuiTheme, ThemeOptions as MuiThemeOptions } from '@mui/material/styles';
import { CustomPalette } from 'theme/types';
import { SvgIconProps as DefaultSvgIconProps } from '@mui/material/SvgIcon/SvgIcon';

declare module '@mui/material/styles' {
  interface Theme extends MuiTheme {
    palette: CustomPalette;
  }
  // allow configuration using `createTheme`
  interface ThemeOptions extends MuiThemeOptions {
    palette: CustomPalette;
  }
}

declare module '@emotion/react' {
  export interface Theme extends MuiTheme {
    palette: CustomPalette;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    'contained.icon': true;
    'outlined.icon': true;
  }
}

declare module '@mui/material/SvgIcon' {
  export type SvgIconProps = DefaultSvgIconProps<
    'svg',
    {
      variant?: 'bubble';
    }
  >;

  export type SvgIconTypeMap = DefaultSvgIconTypeMap<{
    variant?: 'bubble';
  }>;

  export interface SvgIconPropsColorOverrides extends Record<keyof CustomPalette['common'], true> {}

  // export type SvgIconPropsColorOverrides = Record<keyof CustomPalette['common'], true>;
}
