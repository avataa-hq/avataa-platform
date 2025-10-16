import { useStateAndSetters } from '6_shared/lib';
import { accountDataActions, accountDataSliceName } from './accountDataSlice';

export const useAccountData = () => {
  const { state, setters } = useStateAndSetters({
    actions: accountDataActions,
    stateKey: accountDataSliceName,
  });

  return { ...state, ...setters };
};
