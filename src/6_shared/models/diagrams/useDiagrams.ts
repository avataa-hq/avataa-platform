import { useStateAndSetters } from '6_shared/lib';
import { diagramsActions, diagramsSliceName } from './diagramsSlice';

export const useDiagrams = () => {
  const { state, setters } = useStateAndSetters({
    actions: diagramsActions,
    stateKey: diagramsSliceName,
  });

  return { ...state, ...setters };
};
