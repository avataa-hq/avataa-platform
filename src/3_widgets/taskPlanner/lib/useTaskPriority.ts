import { useMemo } from 'react';
import { IColorRangeModel, IKanbanTask, ITaskPriotityColors } from '6_shared';

interface IProps {
  tasks: IKanbanTask[];
  kanbanBoardColorRangesData?: IColorRangeModel | null;
}
export const useTaskPriority = ({ tasks, kanbanBoardColorRangesData }: IProps) => {
  const tasksPriorityColors = useMemo(() => {
    if (!kanbanBoardColorRangesData) return null;
    const { tprmId, ranges } = kanbanBoardColorRangesData;
    const { values, colors } = ranges;

    return tasks.reduce<ITaskPriotityColors>((acc, task) => {
      const taskValue = task[tprmId];
      let colorInfo = colors[colors.length - 1];
      let { name } = colorInfo;

      for (let i = 0; i < values.length; i++) {
        if (taskValue < values[i]) {
          colorInfo = colors[i];
          name = colorInfo.name;
          break;
        }
      }

      acc[task.id] = {
        color: colorInfo.hex,
        name,
      };

      return acc;
    }, {});
  }, [kanbanBoardColorRangesData, tasks]);

  return { tasksPriorityColors };
};
