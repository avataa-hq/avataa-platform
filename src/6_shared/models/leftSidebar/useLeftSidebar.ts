import { useStateAndSetters } from '6_shared/lib';
import { leftSidebarActions, leftSidebarSliceName } from './slice';

export const useLeftSidebar = () => {
  const { state, setters } = useStateAndSetters({
    actions: leftSidebarActions,
    stateKey: leftSidebarSliceName,
  });

  return { ...state, ...setters };
};
