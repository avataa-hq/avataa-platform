import { addMonths } from 'date-fns';
import { IGanttTask, ITimeLineTimeBorders } from '6_shared';

export const getTimeLineTimeDateBorders = (ganttTasks?: IGanttTask[]): ITimeLineTimeBorders => {
  const timeLineStartDate = addMonths(new Date().getTime(), -6);
  const timeLineEndDate = addMonths(new Date().getTime(), 6);
  if (!ganttTasks || !ganttTasks.length) {
    return { timeLineStartDate, timeLineEndDate };
  }

  const { allDates } = ganttTasks.reduce(
    (acc, task) => {
      if (task.start) acc.allDates.push(task.start);
      if (task.end) acc.allDates.push(task.end);
      if (task.progressStart) acc.allDates.push(new Date(task.progressStart));
      if (task.progressEnd) acc.allDates.push(new Date(task.progressEnd));
      return acc;
    },
    { allDates: [] as Date[] },
  );

  const startDate = addMonths(
    new Date(Math.min(timeLineStartDate.getTime(), ...allDates.map((d) => d.getTime()))),
    -1,
  );
  const endDate = addMonths(
    new Date(Math.max(timeLineEndDate.getTime(), ...allDates.map((d) => d.getTime()))),
    1,
  );

  return {
    timeLineStartDate: startDate,
    timeLineEndDate: endDate,
  };
};
