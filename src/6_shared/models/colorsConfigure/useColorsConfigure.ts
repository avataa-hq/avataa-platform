import { useStateAndSetters } from '6_shared/lib';
import { colorsConfigureActions, colorsConfigureSliceName } from './colorsConfigureSlice';

export const useColorsConfigure = () => {
  const { state, setters } = useStateAndSetters({
    actions: colorsConfigureActions,
    stateKey: colorsConfigureSliceName,
  });

  return { ...state, ...setters };
};
