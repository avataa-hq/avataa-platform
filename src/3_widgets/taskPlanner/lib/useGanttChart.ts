import { useEffect, useMemo, useState } from 'react';
import { differenceInDays } from 'date-fns';
import { GantScaleType, IGanttTask, ITimeLineTimeBorders, TimeLineSegments } from '6_shared';
import { getTimeLineTimeDateBorders } from './getTimeLineTimeDateBorders';
import { generateTimelineData } from './generateTimelineDates';

interface IProps {
  tasksRef?: IGanttTask[];
  currentScale: GantScaleType;
  dayScaleWidth: number;
}

export const useGanttChart = ({ tasksRef, currentScale, dayScaleWidth }: IProps) => {
  const [timeLineDateBorders, setTimeLineDateBorders] = useState<ITimeLineTimeBorders | null>(null);
  const [timeLineSegments, setTimeLineSegments] = useState<TimeLineSegments | null>(null);
  const [timeLineTotalWidth, setTimeLineTotalWidth] = useState<number>(0);
  const [headerProgressWidth, setHeaderProgressWidth] = useState(0);

  useEffect(() => {
    const borders = getTimeLineTimeDateBorders(tasksRef);
    setTimeLineDateBorders(borders);
  }, [tasksRef]);

  useEffect(() => {
    if (!timeLineDateBorders) return;
    const { timeLineStartDate, timeLineEndDate } = timeLineDateBorders;

    const segments = generateTimelineData(timeLineStartDate, timeLineEndDate, dayScaleWidth);

    const timeLineWidth = segments.years.reduce((acc, item) => {
      // eslint-disable-next-line no-param-reassign
      acc += item.width;
      return acc;
    }, 0);

    setTimeLineTotalWidth(timeLineWidth);

    setTimeLineSegments(segments);
  }, [dayScaleWidth, timeLineDateBorders]);

  useEffect(() => {
    const firstTask = tasksRef?.[0];
    const activeTask = tasksRef?.find((t) => t.isActive);

    if (firstTask && activeTask) {
      const segments = generateTimelineData(
        firstTask.start!,
        activeTask.progressEnd!,
        dayScaleWidth,
      );

      const progressWidth = segments.years.reduce((acc, item) => {
        // eslint-disable-next-line no-param-reassign
        acc += item.width;
        return acc;
      }, 0);

      setHeaderProgressWidth(progressWidth);
    }
  }, [dayScaleWidth, tasksRef]);

  const dividersList = useMemo(() => {
    if (!timeLineSegments) return [];

    let offset = 0;
    return timeLineSegments[currentScale].reduce((acc, item) => {
      acc.push((offset += item.width));
      return acc;
    }, [] as number[]);
  }, [currentScale, timeLineSegments]);

  const todayPosition = useMemo(() => {
    if (!timeLineDateBorders) return 0;
    const today = new Date();
    const { timeLineStartDate } = timeLineDateBorders;

    return (differenceInDays(today, timeLineStartDate) + 1) * dayScaleWidth;
  }, [dayScaleWidth, timeLineDateBorders]);

  const activeTaskPosition = useMemo(() => {
    if (!tasksRef?.length) return null;
    const activeTask = tasksRef.find((t) => t.isActive);
    if (!activeTask?.start || !timeLineDateBorders) return null;
    const { timeLineStartDate } = timeLineDateBorders;

    return (differenceInDays(activeTask.start, timeLineStartDate) + 1) * dayScaleWidth;
  }, [dayScaleWidth, tasksRef, timeLineDateBorders]);

  const firstTaskScrollPosition = useMemo(() => {
    const firstTask = tasksRef?.[0];
    if (!firstTask?.start || !timeLineDateBorders) return 0;
    const { timeLineStartDate } = timeLineDateBorders;

    if (currentScale === 'days') {
      return (differenceInDays(firstTask.start, timeLineStartDate) + 1) * dayScaleWidth;
    }
    return (differenceInDays(firstTask.start, timeLineStartDate) + 1) * dayScaleWidth;
  }, [currentScale, dayScaleWidth, tasksRef, timeLineDateBorders]);

  // const generalDurationProgress = useMemo(() => {
  //   if (!tasksRef?.length) return 0;
  //   const projectTasks = tasksRef.filter((t) => t.type === 'project');
  //   const generalProgress =
  //     projectTasks.reduce((acc, item) => {
  //       // eslint-disable-next-line no-param-reassign
  //       if (item.progress != null) acc += item.progress;
  //       return acc;
  //     }, 0) / projectTasks.length;
  //   return Number.isNaN(generalProgress) ? 0 : generalProgress;
  // }, [tasksRef]);

  return {
    activeTaskPosition,
    dividersList,
    todayPosition,
    firstTaskScrollPosition,
    timeLineDateBorders,
    timeLineSegments,
    timeLineTotalWidth,
    headerProgressWidth,
  };
};
