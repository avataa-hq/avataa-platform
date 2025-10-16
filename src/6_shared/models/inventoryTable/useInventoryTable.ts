import { useStateAndSetters } from '6_shared/lib';
import { invTableActions, invTableSliceName } from './invTableSlice';

export const useInventoryTable = () => {
  const { state, setters } = useStateAndSetters({
    actions: invTableActions,
    stateKey: invTableSliceName,
  });

  return { ...state, ...setters };
};
