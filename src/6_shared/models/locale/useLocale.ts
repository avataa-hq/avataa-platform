import { useStateAndSetters } from '6_shared/lib';
import { localeActions, localeSliceName } from './localeSlice';

export const useLocale = () => {
  const { state, setters } = useStateAndSetters({
    actions: localeActions,
    stateKey: localeSliceName,
  });

  return { ...state, ...setters };
};
