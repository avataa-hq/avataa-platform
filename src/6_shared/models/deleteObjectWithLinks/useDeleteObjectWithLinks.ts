import { useStateAndSetters } from '6_shared/lib';
import {
  deleteObjectWithLinksActions,
  deleteObjectWithLinksSliceName,
} from './deleteObjectWithLinksSlice';

export const useDeleteObjectWithLinks = () => {
  const { state, setters } = useStateAndSetters({
    actions: deleteObjectWithLinksActions,
    stateKey: deleteObjectWithLinksSliceName,
  });

  return { ...state, ...setters };
};
