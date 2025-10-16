import { useMemo } from 'react';
import 'dayjs/locale/en';
import 'dayjs/locale/de';
import 'dayjs/locale/ru';
import 'dayjs/locale/uk';
import { useLocale } from '6_shared/models';

export const useAdapterLocale = () => {
  const { currentLocale } = useLocale();

  const adapterLocale = useMemo(() => {
    return currentLocale.code.slice(0, 2) || 'en';
  }, [currentLocale.code]);

  return { adapterLocale };
};
