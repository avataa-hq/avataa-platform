import { useStateAndSetters } from '6_shared';
import { hierarchyActions, hierarchySliceName } from './hierarchySlice';

export const useHierarchy = () => {
  const { state, setters } = useStateAndSetters({
    actions: hierarchyActions,
    stateKey: hierarchySliceName,
  });

  return { ...state, ...setters };
};
