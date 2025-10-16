import { Subset } from 'types';
import { CustomPalette } from './types';

export const redPalette: Subset<CustomPalette> = {
  primary: {
    main: '#e6363f',
    dark: '#C72C33',
    light: '#E6363F',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#83899C',
  },
  error: {
    main: '#c91f27',
  },
  success: {
    main: '#00A143',
  },
  warning: {
    main: '#FAB500',
  },
  text: {
    primary: '#393939',
  },
  neutral: {
    surface: '#F2F3F7',
    surfaceContainerLow: '#F2F3F765',
    surfaceContainerLowest: '#FFFFFF',
    surfaceContainer: '#F2F3F7',
  },
  neutralVariant: {
    icon: '#D4D4DB',
    iconDisabled: '#EFEFF2',
    outline: '#E6E9F5',
    // scroll: '#CDD2E2',
  },
  components: {
    scrollBar: {
      background: '#CDD2E2',
    },
    sidebar: {
      background: '#ffffff',
      text: '#393939',
      activeText: '#e6363f',
      outline: '#E6E9F5',
      outlineVariant: '#E6E9F5',
    },
  },
};
