import { useStateAndSetters } from '6_shared/lib';
import { inventoryMapWidgetActions, inventoryMapWidgetSliceName } from './inventoryMapWidgetSlice';

export const useInventoryMapWidget = () => {
  const { state, setters } = useStateAndSetters({
    actions: inventoryMapWidgetActions,
    stateKey: inventoryMapWidgetSliceName,
  });

  return { ...state, ...setters };
};
