import { useStateAndSetters } from '6_shared/lib';
import { shareStateActions, shareStateSliceName } from './slice';

export const useShareState = () => {
  const { state, setters } = useStateAndSetters({
    actions: shareStateActions,
    stateKey: shareStateSliceName,
  });

  return { ...state, ...setters };
};
