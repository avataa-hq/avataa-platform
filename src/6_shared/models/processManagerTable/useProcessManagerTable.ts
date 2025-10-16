import { useStateAndSetters } from '6_shared';
import {
  processManagerTableActions,
  processManagerTableSliceName,
} from './processManagerTableSlice';

export const useProcessManagerTable = () => {
  const { state, setters } = useStateAndSetters({
    actions: processManagerTableActions,
    stateKey: processManagerTableSliceName,
  });

  return {
    ...state,
    ...setters,
  };
};
