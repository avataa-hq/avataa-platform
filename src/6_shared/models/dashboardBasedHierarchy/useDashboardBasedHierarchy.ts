import { useStateAndSetters } from '6_shared/lib';
import { dashboardBasedHierarchyActions, dashboardBasedHierarchySliceName } from './slice';

export const useDashboardBasedHierarchy = () => {
  const { state, setters } = useStateAndSetters({
    actions: dashboardBasedHierarchyActions,
    stateKey: dashboardBasedHierarchySliceName,
  });

  return { ...state, ...setters };
};
