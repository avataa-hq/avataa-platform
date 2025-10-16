import { useStateAndSetters } from '6_shared/lib';
import { taskManagerActions, taskManagerSliceName } from './taskManagerSlice';

export const useTaskManager = () => {
  const { state, setters } = useStateAndSetters({
    actions: taskManagerActions,
    stateKey: taskManagerSliceName,
  });

  return { ...state, ...setters };
};
