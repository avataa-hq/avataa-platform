import '@emotion/react';
import { Palette as MuiPalette } from '@mui/material/styles';

export interface CustomPalette extends MuiPalette {
  neutral: Neutral;
  neutralVariant: NeutralVariant;
  components: Components;
  common: CommonColors;
}

interface Neutral {
  surface: string;
  surfaceContainerLowest: string;
  surfaceContainerLowestVariant1: string;
  surfaceContainerLowestVariant2: string;
  surfaceContainerLow: string;
  surfaceContainerLowVariant1: string;
  surfaceContainerLowVariant2: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  backdrop: string;
}

interface NeutralVariant {
  onSurface: string;
  onSurfaceVariant10: string;
  onSurfaceVariant20: string;
  onSurfaceVariant50: string;
  onSurfaceVariant60: string;
  icon: string;
  iconDisabled: string;
  outline: string;
  outlineVariant: string;
  outlineVariant20: string;
  outlineVariant30: string;
  tableBorder: string;
}

interface Components {
  scrollBar: {
    background: string;
    thumbBackground: string;
    cornerBackground: string;
  };
  sidebar: {
    background: string;
    text: string;
    activeText: string;
    outline: string;
    outlineVariant: string;
  };
  map: {
    surfaceContainer: string;
    outline: string;
    tooltipBackground: string;
    iconColor: string;
    iconColor2: string;
    iconColor3: string;
    iconColor4: string;
    border: string;
    hover: string;
  };
  chart: {
    colors: string[];
    primary: string;
    secondary: string;
    primaryLine: string;
    primaryLineSurface: string;
    labelColor: string;
    labelBackdropColor: string;
    gridBorderColor: string;
    gridColor: string;
    tooltipBackgroundColor: string;
    backgroundColor: string;
    ml: {
      borderColor1: string;
      borderColor2: string;
      background: string;
    };
  };
  logo: {
    small: string;
    large: string;
  };
  reactFlow: {
    nodeBackgroundStandard: string;
    nodeBackgroundSecondary: string;
    nodeBackgroundMain: string;
    flowChartBackground: string;
  };
}

interface CommonColors {
  black: string;
  white: string;
  blue: string;
  orange: string;
  purple: string;
  jungleGreen: string;
  dodgerBlue: string;
  saffronYellow: string;
  brightGreen: string;
  lightDodgerBlue: string;
  amaranthRed: string;
  royalBlue: string;
  denimBlue: string;
  crustaOrange: string;
  malachiteGreen: string;
  flirtPurple: string;
  javaBlue: string;
  brilliantRose: string;
}
