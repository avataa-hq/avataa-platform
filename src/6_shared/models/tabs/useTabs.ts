import { useStateAndSetters } from '6_shared/lib';
import { tabsActions, tabsSliceName } from './tabSlice';

export const useTabs = () => {
  const { state, setters } = useStateAndSetters({
    actions: tabsActions,
    stateKey: tabsSliceName,
  });

  return { ...state, ...setters };
};
