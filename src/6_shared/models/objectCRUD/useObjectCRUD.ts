import { useStateAndSetters } from '6_shared/lib';
import { objectCRUDActions, objectCRUDSliceName } from './objectCRUDSlice';

export const useObjectCRUD = () => {
  const { state, setters } = useStateAndSetters({
    actions: objectCRUDActions,
    stateKey: objectCRUDSliceName,
  });

  return { ...state, ...setters };
};
