import React, { useState } from 'react';
import { addDays } from 'date-fns';
import { CREATE_TASK_DURATION, IGanttTask } from '6_shared';

interface IProps {
  task: IGanttTask;
  dayWidth: number;
  timeLineStartDate?: Date;
  handleCreateTimeLineTask: (newTask: IGanttTask) => void;
}

export const useCreateTimeLineTask = ({
  task,
  dayWidth,
  timeLineStartDate,
  handleCreateTimeLineTask,
}: IProps) => {
  const [hoveredRowTaskPosition, setHoveredRowTaskPosition] = useState<number | null>(null);

  const handleRowMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (task.start || task.end) return;
    const rowRect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rowRect.left;
    const snappedPosition = Math.round(offsetX / dayWidth) * dayWidth;
    setHoveredRowTaskPosition(snappedPosition);
  };

  const handleRowMouseLeave = () => {
    setHoveredRowTaskPosition(null);
  };

  const handleCreateTimeLineTaskClick = () => {
    if (!hoveredRowTaskPosition || task.start || task.end || !timeLineStartDate) return;
    const startDate = addDays(timeLineStartDate, Math.floor(hoveredRowTaskPosition / dayWidth));
    const endDate = addDays(startDate, CREATE_TASK_DURATION);
    const newTask = { ...task, start: startDate, end: endDate };
    handleCreateTimeLineTask(newTask);
  };

  return {
    hoveredRowTaskPosition,
    handleRowMouseMove,
    handleRowMouseLeave,
    handleCreateTimeLineTaskClick,
  };
};
