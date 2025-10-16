import { useStateAndSetters } from '6_shared/lib';
import { configActions, configSliceName } from './configSlice';

export const useConfig = () => {
  const { state, setters } = useStateAndSetters({
    actions: configActions,
    stateKey: configSliceName,
  });

  return { ...state, ...setters };
};
