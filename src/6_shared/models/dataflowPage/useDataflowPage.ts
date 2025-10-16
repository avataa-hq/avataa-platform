import { useStateAndSetters } from '6_shared/lib';
import { dataflowPageActions, dataflowPageSliceName } from './dataflowPageSlice';

export const useDataflowPage = () => {
  const { state, setters } = useStateAndSetters({
    actions: dataflowPageActions,
    stateKey: dataflowPageSliceName,
  });

  return { ...state, ...setters };
};
