import { PaletteMode } from '@mui/material';
import { deDE, enUS, ruRU, ukUA } from '@mui/material/locale';
import {
  deDE as gridDeDE,
  enUS as gridEnUS,
  ruRU as gridRuRU,
  ukUA as gridUkUA,
} from '@mui/x-data-grid-premium/locales';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Locale } from '6_shared';

interface ThemeState {
  mode: PaletteMode;
  locale: any;
}

const muiLocales = {
  enUS: [enUS, gridEnUS],
  deDE: [deDE, gridDeDE],
  ruRU: [ruRU, gridRuRU],
  ukUA: [ukUA, gridUkUA],
};

const initialState: ThemeState = {
  mode: 'light',
  locale: muiLocales.enUS,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    themeSwitch(state) {
      if (state.mode === 'dark') {
        state.mode = 'light';
      } else {
        state.mode = 'dark';
      }
    },
    setMuiLocale(state, action) {
      state.locale = muiLocales[action.payload as Locale] || muiLocales.enUS;
    },
    restore: (_, action: PayloadAction<ThemeState>) => action.payload,
  },
});

export const themeActions = themeSlice.actions;
export const themeReducer = themeSlice.reducer;
export const themeSliceName = themeSlice.name;
