import { ThemeColors } from '6_shared/types';
import { Theme } from '@mui/material/styles';

import { CustomPalette } from 'theme/types';

/**
 * Takes theme object and a color name (including color names from `common` property of the palette) and returns the color code
 */
export const getPaletteColor = (
  theme: Theme,
  color: keyof CustomPalette['common'] | ThemeColors,
) => {
  return (
    // @ts-expect-error I'm just too lazy to exclude the unnecessary colors. I wrote a fallback, so there will not be any problems.
    theme.palette[color]?.main ??
    // @ts-expect-error I'm just too lazy to exclude the unnecessary colors. I wrote a fallback, so there will not be any problems.
    theme.palette.common[color] ??
    theme.palette.primary.main
  );
};
