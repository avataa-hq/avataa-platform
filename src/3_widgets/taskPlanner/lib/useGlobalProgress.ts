import { MutableRefObject, useCallback, useEffect, useMemo, useState } from 'react';
import { useTheme } from '@mui/material';
import {
  IColorSegments,
  IGanttTask,
  ITaskPlannerDatesBorders,
  ITimeLineTimeBorders,
  ON_TASKS_LOAD,
} from '6_shared';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function calcProgressPercent({
  planStart,
  planEnd,
  factStart,
  factEnd,
  currentDate = new Date(),
}: {
  planStart: Date;
  planEnd: Date;
  factStart: Date;
  factEnd?: Date;
  currentDate?: Date;
}): number {
  const planStartDate = new Date(planStart).getTime();
  const planEndDate = new Date(planEnd).getTime();
  const factStartDate = new Date(factStart).getTime();
  const factEndDate = factEnd ? new Date(factEnd).getTime() : currentDate.getTime();

  const planDuration = planEndDate - planStartDate;
  if (planDuration <= 0) return 0;

  // Фактическое "текущее" время — не позже currentDate и не раньше factStart
  const effectiveFactEnd = Math.min(factEndDate, currentDate.getTime());
  const effectiveFactStart = factStartDate;

  const elapsedFactDuration = effectiveFactEnd - effectiveFactStart;

  // Процент выполнения — сколько из плана прошло
  const percent = (elapsedFactDuration / planDuration) * 100;

  return percent;
}

interface IProps {
  tasks?: IGanttTask[];
  timeLineDateBorders: ITimeLineTimeBorders | null;
  dayScaleWidth: number;

  dateBordersRef?: MutableRefObject<ITaskPlannerDatesBorders>;
}

export const useGlobalProgress = ({
  tasks,
  timeLineDateBorders,
  dayScaleWidth,
  dateBordersRef,
}: IProps) => {
  const { palette } = useTheme();
  const [presentOfProgress, setPresentOfProgress] = useState(0);

  const getPresentOfProgress = useCallback(() => {
    if (
      !dateBordersRef?.current ||
      !dateBordersRef?.current?.planStart ||
      !dateBordersRef?.current?.planEnd ||
      !dateBordersRef?.current?.factStart ||
      !dateBordersRef?.current?.factEnd
    ) {
      return;
    }
    setPresentOfProgress(
      calcProgressPercent({
        planStart: dateBordersRef?.current.planStart,
        planEnd: dateBordersRef?.current.planEnd,
        factStart: dateBordersRef?.current.factStart,
        factEnd: dateBordersRef?.current.factEnd,
      }),
    );
  }, [dateBordersRef]);

  useEffect(() => {
    window.addEventListener(ON_TASKS_LOAD, getPresentOfProgress);
    return () => {
      window.removeEventListener(ON_TASKS_LOAD, getPresentOfProgress);
    };
  }, [getPresentOfProgress]);

  const globalProgressColorSegments: IColorSegments[] = useMemo(() => {
    if (!tasks || !timeLineDateBorders) return [];

    const { timeLineStartDate, timeLineEndDate } = timeLineDateBorders;
    const timelineStart = timeLineStartDate.getTime();
    const timelineEnd = timeLineEndDate.getTime();

    const totalDays = (timelineEnd - timelineStart) / DAY_IN_MS;

    const earliestProgressStart = tasks
      .map((task) => (task.progressStart ? new Date(task.progressStart).getTime() : Infinity))
      .filter((date) => date !== Infinity)
      .reduce((min, date) => Math.min(min, date), Infinity);

    const latestProgressEnd = tasks
      .map((task) => {
        const progressEnd = task.progressEnd
          ? new Date(task.progressEnd).getTime()
          : task.end?.getTime() ?? -Infinity;
        return progressEnd;
      })
      .reduce((max, date) => Math.max(max, date), -Infinity);

    return Array.from({ length: totalDays }, (_, index) => {
      const day = timelineStart + index * DAY_IN_MS;
      let color = 'transparent';

      if (day < earliestProgressStart) {
        color = palette.error.light;
      } else if (day <= latestProgressEnd) {
        const activeTask = tasks.find((task) => {
          const taskStart = task.start?.getTime() ?? Infinity;
          const progressStart = task.progressStart
            ? new Date(task.progressStart).getTime()
            : taskStart;

          return day >= taskStart && day < progressStart;
        });

        const inProgressTask = tasks.find((task) => {
          const progressStart = task.progressStart
            ? new Date(task.progressStart).getTime()
            : task.start?.getTime() ?? Infinity;
          return day >= progressStart && day <= latestProgressEnd;
        });

        if (activeTask) {
          const progressStart = activeTask.progressStart
            ? new Date(activeTask.progressStart).getTime()
            : activeTask.start?.getTime() ?? Infinity;

          color = day >= progressStart ? palette.success.light : palette.warning.light;
        } else if (inProgressTask) {
          color = palette.success.light;
        }
      }

      if (day > latestProgressEnd) {
        color = 'transparent';
      }

      return { color, width: dayScaleWidth };
    });
  }, [
    dayScaleWidth,
    palette.error.light,
    palette.success.light,
    palette.warning.light,
    tasks,
    timeLineDateBorders,
  ]);

  return { globalProgressColorSegments, presentOfProgress };
};
