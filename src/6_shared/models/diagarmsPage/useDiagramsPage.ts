import { useStateAndSetters } from '6_shared/lib';
import { diagramsPageActions, diagramsPageSliceName } from './diagramsPageSlice';

export const useDiagramsPage = () => {
  const { state, setters } = useStateAndSetters({
    actions: diagramsPageActions,
    stateKey: diagramsPageSliceName,
  });

  return { ...state, ...setters };
};
