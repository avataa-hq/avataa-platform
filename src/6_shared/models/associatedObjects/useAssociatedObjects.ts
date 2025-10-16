import { useStateAndSetters } from '6_shared/lib';
import { associatedObjectsActions, associatedObjectsSliceName } from './associatedObjectsSlice';

export const useAssociatedObjects = () => {
  const { state, setters } = useStateAndSetters({
    actions: associatedObjectsActions,
    stateKey: associatedObjectsSliceName,
  });

  return { ...state, ...setters };
};
