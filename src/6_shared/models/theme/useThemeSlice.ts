import { useStateAndSetters } from '6_shared/lib';
import { themeActions, themeSliceName } from './themeSlice';

export const useThemeSlice = () => {
  const { state, setters } = useStateAndSetters({
    actions: themeActions,
    stateKey: themeSliceName,
  });

  return { ...state, ...setters };
};
