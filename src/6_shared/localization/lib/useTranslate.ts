import { useCallback } from 'react';
import { useLocale } from '6_shared/models';
import en from '../translations/en.json';

export const useTranslate = () => {
  const { translations } = useLocale();

  const translate = useCallback(
    (...text: (keyof typeof en | number)[]) => {
      // Need to check if hasOwnProperty instead of 'in' in order to
      // prevent name collision with Object's prototype properties

      return text
        .map((txt) => {
          if (typeof txt === 'number') {
            return txt;
          }

          if (translations.hasOwnProperty(txt)) {
            return translations[txt];
          }
          return txt;
        })
        .join(' ');
    },
    [translations],
  );

  return translate;
};
