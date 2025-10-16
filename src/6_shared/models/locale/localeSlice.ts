import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAvailableLocales } from '../../localization/lib';

import de from '../../localization/translations/de.json';
import ru from '../../localization/translations/ru.json';
import uk from '../../localization/translations/uk.json';
import en from '../../localization/translations/en.json';

import { Locale, LocaleMap } from './types';

const translations = {
  deDE: de,
  ruRU: ru,
  ukUA: uk,
  enUS: en,
};

interface LocaleState {
  currentLocale: {
    code: Locale;
    name: string;
  };
  availableLocales: LocaleMap;
  translations: typeof en;
}

const initialState: LocaleState = {
  currentLocale: {
    code: 'enUS',
    name: 'ENG',
  },
  availableLocales: getAvailableLocales(),
  translations: en,
};

const localeSlice = createSlice({
  name: 'locale',
  initialState,
  reducers: {
    setLocale(state, action: PayloadAction<string>) {
      const selectedLocale = state.availableLocales[action.payload as Locale];
      if (selectedLocale) {
        state.currentLocale = selectedLocale;
        // @ts-ignore
        state.translations = translations[selectedLocale.code];
      }
    },
    restore: (_, action: PayloadAction<LocaleState>) => action.payload,
  },
});

export const localeActions = localeSlice.actions;
export const localeReducer = localeSlice.reducer;
export const localeSliceName = localeSlice.name;
