import { useStateAndSetters } from '6_shared/lib';
import { dataflowDiagramActions, dataflowDiagramSliceName } from './dataflowDiagramSlice';

export const useDataflowDiagram = () => {
  const { state, setters } = useStateAndSetters({
    actions: dataflowDiagramActions,
    stateKey: dataflowDiagramSliceName,
  });

  return { ...state, ...setters };
};
