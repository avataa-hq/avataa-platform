import { useStateAndSetters } from '6_shared/lib';
import { layersActions, layersSliceName } from './layersSlice';

export const useLayersSlice = () => {
  const { state, setters } = useStateAndSetters({
    actions: layersActions,
    stateKey: layersSliceName,
  });

  return { ...state, ...setters };
};
