import { useStateAndSetters } from '6_shared/lib';
import {
  dataflowDiagramPageActions,
  dataflowDiagramPageSliceName,
} from './dataflowDiagramPageSlice';

export const useDataflowDiagramPage = () => {
  const { state, setters } = useStateAndSetters({
    actions: dataflowDiagramPageActions,
    stateKey: dataflowDiagramPageSliceName,
  });

  return { ...state, ...setters };
};
