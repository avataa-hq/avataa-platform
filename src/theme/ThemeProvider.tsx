import { patchObject, useConfig, useThemeSlice } from '6_shared';
import styled from '@emotion/styled';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

import { Subset } from 'types';

import createMyTheme from './createTheme';
import { BG_DARK_DEFAULT, darkPalette } from './darkPalette';
import { redPalette } from './redPalette';
import { CustomPalette } from './types';

const themes: Record<string, Record<'light' | 'dark', Subset<CustomPalette>>> = {
  red: {
    light: redPalette,
    dark: darkPalette,
  },
};

const favicons: Record<string, string> = {
  avataa: '/AVATAA_favicon.ico',
};

const AppContainer = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
  background: ${({ theme }) =>
    theme.palette.mode === 'dark'
      ? `url("${BG_DARK_DEFAULT}") no-repeat fixed center/cover`
      : `#f5f5f5`};
`;

const ThemeProvider = ({ children }: React.PropsWithChildren) => {
  const { mode, locale } = useThemeSlice();
  const { config } = useConfig();

  // Apply logo
  const logo = { large: config._logoLightLarge, small: config._logoLightSmall };
  const favicon = favicons[config._favicon] ?? config._favicon;

  // Apply page title
  const title = config._pageTitle;

  if (title) {
    document.title = title;
  }

  // Apply favicon
  const link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
  const shortcutIconLink: HTMLLinkElement | null = document.querySelector(
    "link[rel='shortcut icon']",
  );

  if (link) {
    link.href = favicon; // Replace with the path to your new favicon
  }
  if (shortcutIconLink) {
    shortcutIconLink.href = favicon; // Replace with the path to your new favicon
  }

  // const theme = createMyTheme(mode, locale, { light: redPalette });
  const theme = createMyTheme(mode, locale, {
    light:
      config._theme && themes.hasOwnProperty(config._theme)
        ? patchObject(themes[config._theme].light, { components: { logo } })
        : { components: { logo } },
    dark:
      config._theme && themes.hasOwnProperty(config._theme)
        ? patchObject(themes[config._theme].dark, { components: { logo } })
        : { components: { logo } },
  });

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <AppContainer component="div">{children}</AppContainer>
    </MuiThemeProvider>
  );
};

export default ThemeProvider;
