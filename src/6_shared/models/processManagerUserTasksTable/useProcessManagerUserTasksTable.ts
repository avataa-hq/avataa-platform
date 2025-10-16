import { useStateAndSetters } from '6_shared/lib';
import {
  processManagerUserTasksTableActions,
  processManagerUserTasksTableSliceName,
} from './processManagerUserTasksTableSlice';

export const useProcessManagerUserTasksTable = () => {
  const { state, setters } = useStateAndSetters({
    actions: processManagerUserTasksTableActions,
    stateKey: processManagerUserTasksTableSliceName,
  });

  return { ...state, ...setters };
};
