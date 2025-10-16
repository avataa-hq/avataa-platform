import { useStateAndSetters } from '6_shared';
import { processManagerActions, processManagerSliceName } from './processManagerSlice';

export const useProcessManager = () => {
  const { state, setters } = useStateAndSetters({
    actions: processManagerActions,
    stateKey: processManagerSliceName,
  });

  return { ...state, ...setters };
};
