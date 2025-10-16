import { useStateAndSetters } from '6_shared/lib';
import { inventoryActions, inventorySliceName } from './inventorySlice';

export const useInventory = () => {
  const { state, setters } = useStateAndSetters({
    actions: inventoryActions,
    stateKey: inventorySliceName,
  });

  return { ...state, ...setters };
};
