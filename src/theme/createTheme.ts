import { PaletteMode } from '@mui/material';
import { createTheme, Theme } from '@mui/material/styles';

import { Subset } from 'types';
import { patchObject } from '6_shared';

import { CustomPalette } from './types';
import { components } from './components';
import { darkPalette } from './darkPalette';
import { lightPalette } from './lightPalette';
import typography from './typography';
import { shadows } from './shadows';

/**
 *
 * @param mode
 * @param locale
 * @param customPalette custom palette that will overwrite the default one
 * @returns MUI Theme with CustomPalette
 */
const createMyTheme = (
  mode: PaletteMode,
  locale: object[],
  customPalette?: { light?: Subset<CustomPalette>; dark?: Subset<CustomPalette> },
): Theme & { palette: CustomPalette } => {
  const palette =
    mode === 'dark'
      ? patchObject(darkPalette, customPalette?.dark ?? {})
      : patchObject(lightPalette, customPalette?.light ?? {});

  return createTheme(
    {
      palette: {
        mode,
        ...(palette as Omit<CustomPalette, 'mode'>),
      },
      shape: {
        borderRadius: 5,
      },
      typography,
      components,
      shadows,
    },
    ...locale,
  ) as Theme & { palette: CustomPalette };
};

export default createMyTheme;
