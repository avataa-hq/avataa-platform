import { useStateAndSetters } from '6_shared/lib';
import { userManagementActions, userManagementSliceName } from './userManagementSlice';

export const useUserManagement = () => {
  const { state, setters } = useStateAndSetters({
    actions: userManagementActions,
    stateKey: userManagementSliceName,
  });

  return { ...state, ...setters };
};
