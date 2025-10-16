import { useStateAndSetters } from '6_shared/lib';
import { objectDetailsPageActions, objectDetailsPageSliceName } from './objectDetailsPageSlice';

export const useObjectDetails = () => {
  const { state, setters } = useStateAndSetters({
    actions: objectDetailsPageActions,
    stateKey: objectDetailsPageSliceName,
  });

  return { ...state, ...setters };
};
