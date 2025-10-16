import { Locale, LocaleMap } from '6_shared/models';
import config from 'config';

const localeMap: LocaleMap = {
  enUS: {
    code: 'enUS',
    name: 'ENG',
  },
  deDE: {
    code: 'deDE',
    name: 'DE',
  },
  ruRU: {
    code: 'ruRU',
    name: 'RU',
  },
  ukUA: {
    code: 'ukUA',
    name: 'UA',
  },
};

export const getAvailableLocales = () => {
  const availableLocales = {} as LocaleMap;
  config._availableLocales?.split(',').forEach((l) => {
    availableLocales[l as Locale] = localeMap[l as Locale];
  });

  if (!availableLocales || Object.keys(availableLocales).length < 1) {
    return {
      enUS: {
        code: 'enUS' as Locale,
        name: 'ENG',
      },
    };
  }

  return availableLocales;
};
