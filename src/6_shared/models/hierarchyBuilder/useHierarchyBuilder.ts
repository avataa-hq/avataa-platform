import { useStateAndSetters } from '6_shared/lib';
import { hierarchyBuilderActions, hierarchyBuilderSliceName } from './hierarchyBuilderSlice';

export const useHierarchyBuilder = () => {
  const { state, setters } = useStateAndSetters({
    actions: hierarchyBuilderActions,
    stateKey: hierarchyBuilderSliceName,
  });

  return { ...state, ...setters };
};
