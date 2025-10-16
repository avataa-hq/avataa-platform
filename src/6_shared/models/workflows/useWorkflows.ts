import { useStateAndSetters } from '6_shared/lib';
import { workflowsActions, workflowsSliceName } from './workflowsSlice';

export const useWorkflows = () => {
  const { state, setters } = useStateAndSetters({
    actions: workflowsActions,
    stateKey: workflowsSliceName,
  });

  return { ...state, ...setters };
};
