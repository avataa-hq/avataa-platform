import { useStateAndSetters } from '6_shared/lib';
import { sidebarActions, sidebarSliceName } from './sidebarSlice';

export const useSidebar = () => {
  const { state, setters } = useStateAndSetters({
    actions: sidebarActions,
    stateKey: sidebarSliceName,
  });

  return { ...state, ...setters };
};
