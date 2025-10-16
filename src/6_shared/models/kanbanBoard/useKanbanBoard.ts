import { useStateAndSetters } from '6_shared/lib';
import { kanbanBoardActions, kanbanBoardSliceName } from './kanbanBoardSlice';

export const useKanbanBoard = () => {
  const { state, setters } = useStateAndSetters({
    actions: kanbanBoardActions,
    stateKey: kanbanBoardSliceName,
  });

  return { ...state, ...setters };
};
