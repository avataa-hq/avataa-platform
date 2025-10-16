import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import {
  addDays,
  differenceInDays,
  isAfter,
  isBefore,
  isEqual,
  isWithinInterval,
  startOfDay,
} from 'date-fns';
import { useTheme } from '@mui/material';
import * as d3 from 'd3';
import { IGanttTask } from '6_shared';

interface IProps {
  task: IGanttTask;
  timeLineStartDate?: Date;
  dayWidth: number;
  updateTask: (taskId: string, newStart: Date, newEnd: Date) => void;
  onUpdateLineTasks: (taskId: string, newStart: Date, newEnd: Date) => void;
}

export const useTimeLineTask = ({
  dayWidth,
  task,
  timeLineStartDate,
  updateTask,
  onUpdateLineTasks,
}: IProps) => {
  const { palette } = useTheme();

  const accumulatedResizeDeltaRef = useRef(0);
  const accumulatedDragDeltaRef = useRef(0);
  const [taskStartDate, setTaskStartDate] = useState<Date>(new Date());
  const [taskEndDate, setTaskEndDate] = useState<Date>(new Date());
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [resizeSide, setResizeSide] = useState<'left' | 'right' | null>(null);
  const [startX, setStartX] = useState<number | null>(null);

  useEffect(() => {
    if (!task.start || !task.end) return;
    setTaskStartDate(task.start);
    setTaskEndDate(task.end);
  }, [task.end, task.start]);

  // ----------------- RESIZE LOGIC -----------------
  const handleResizeStart = (side: 'left' | 'right') => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeSide(side);
    setStartX(e.clientX);
    accumulatedResizeDeltaRef.current = 0;
  };

  const handleResizeMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !resizeSide || startX === null) return;

      const deltaX = e.clientX - startX;
      accumulatedResizeDeltaRef.current += deltaX;
      const wholeDays = Math.trunc(accumulatedResizeDeltaRef.current / dayWidth);
      if (wholeDays !== 0) {
        let newStart = taskStartDate;
        let newEnd = taskEndDate;
        if (resizeSide === 'left') {
          const tempStart = addDays(taskStartDate, wholeDays);
          if (differenceInDays(taskEndDate, tempStart) >= 0) {
            newStart = tempStart;
          }
        } else if (resizeSide === 'right') {
          const tempEnd = addDays(taskEndDate, wholeDays);
          if (differenceInDays(tempEnd, taskStartDate) >= 0) {
            newEnd = tempEnd;
          }
        }
        onUpdateLineTasks(task.id.toString(), newStart, newEnd);
        setTaskStartDate(newStart);
        setTaskEndDate(newEnd);
        accumulatedResizeDeltaRef.current -= wholeDays * dayWidth;
      }
      setStartX(e.clientX);
    },
    [
      isResizing,
      resizeSide,
      startX,
      dayWidth,
      taskStartDate,
      taskEndDate,
      task.id,
      onUpdateLineTasks,
    ],
  );

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    setResizeSide(null);
    updateTask(task.id.toString(), taskStartDate, taskEndDate);
    accumulatedResizeDeltaRef.current = 0;
  }, [updateTask, task.id, taskStartDate, taskEndDate]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResizeMove);
      window.addEventListener('mouseup', handleResizeEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleResizeMove);
      window.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [isResizing, handleResizeMove, handleResizeEnd]);
  // ----------------- /RESIZE LOGIC -----------------

  // ----------------- DRAG & DROP LOGIC -----------------
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setStartX(e.clientX);
    accumulatedDragDeltaRef.current = 0;
  }, []);

  const handleDragMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || startX === null) return;
      const deltaX = e.clientX - startX;
      accumulatedDragDeltaRef.current += deltaX;
      const wholeDays = Math.trunc(accumulatedDragDeltaRef.current / dayWidth);
      if (wholeDays !== 0) {
        const newStart = addDays(taskStartDate, wholeDays);
        const newEnd = addDays(taskEndDate, wholeDays);
        setTaskStartDate(newStart);
        setTaskEndDate(newEnd);
        onUpdateLineTasks(task.id.toString(), newStart, newEnd);
        accumulatedDragDeltaRef.current -= wholeDays * dayWidth;
      }
      setStartX(e.clientX);
    },
    [isDragging, startX, dayWidth, taskStartDate, taskEndDate, onUpdateLineTasks, task.id],
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    updateTask(task.id.toString(), taskStartDate, taskEndDate);
    accumulatedDragDeltaRef.current = 0;
  }, [updateTask, task.id, taskStartDate, taskEndDate]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);
  // ----------------- /DRAG & DROP LOGIC -----------------

  const taskPositionAndWidth = useMemo(() => {
    const leftOffset =
      differenceInDays(startOfDay(taskStartDate), startOfDay(timeLineStartDate!)) * dayWidth;
    const width =
      (differenceInDays(startOfDay(taskEndDate), startOfDay(taskStartDate)) + 1) * dayWidth;
    const correctedLeftOffset = Number.isNaN(leftOffset) ? 0 : leftOffset;
    const correctedWidth = Number.isNaN(width) ? 5 : width;

    return { leftOffset: correctedLeftOffset, width: correctedWidth };
  }, [taskStartDate, taskEndDate, timeLineStartDate, dayWidth]);

  const progressPositionAndWidth = useMemo(() => {
    if (!task.progressStart || !task.progressEnd || !task.start || task.type === 'milestone') {
      return { progressLeftOffset: 0, progressWidth: 0 };
    }

    const progressStart = startOfDay(new Date(task.progressStart));
    const progressEnd = startOfDay(new Date(task.progressEnd));

    const relativeProgressLeftOffset =
      differenceInDays(progressStart, startOfDay(new Date(task.start))) * dayWidth;

    const rawProgressWidth = (differenceInDays(progressEnd, progressStart) + 1) * dayWidth;

    return { progressLeftOffset: relativeProgressLeftOffset, progressWidth: rawProgressWidth };
  }, [task.progressStart, task.progressEnd, task.start, task.type, dayWidth]);

  const getTaskProgressBG = (
    progressStart: Date,
    progressEnd: Date,
    taskStart: Date,
    taskEnd: Date,
    isActive?: boolean,
  ) => {
    const pStart = startOfDay(new Date(progressStart));
    const pEnd = startOfDay(new Date(progressEnd));
    const tStart = startOfDay(new Date(taskStart));
    const tEnd = startOfDay(new Date(taskEnd));

    const isProgressEndAfterTaskEnd = isAfter(pEnd, tEnd);
    const isProgressEndEqualTaskEnd = isEqual(pEnd, tEnd);
    const isProgressEndBeforeTaskStart = isBefore(pEnd, tStart);
    const isProgressEndInTask = isWithinInterval(pEnd, { start: tStart, end: tEnd });

    if (isProgressEndAfterTaskEnd) return palette.error.main;
    if ((isProgressEndInTask && !isProgressEndEqualTaskEnd) || isProgressEndBeforeTaskStart) {
      if (isActive) return palette.success.main;
      return palette.warning.main;
    }
    if (isProgressEndEqualTaskEnd) return palette.success.main;

    return palette.primary.light;
  };

  const onTaskMouseEnter = (taskId: string) => {
    d3.selectAll(`.cross-source-${taskId}, .cross-target-${taskId}`)
      .transition()
      .duration(200)
      .style('opacity', 1);

    d3.selectAll(`.link-source-${taskId}, .link-target-${taskId}`)
      .transition()
      .duration(200)
      .style('stroke', palette.success.light);
  };

  const onTaskMouseLeave = (taskId: string) => {
    d3.selectAll(`.cross-source-${taskId}, .cross-target-${taskId}`)
      .transition()
      .duration(200)
      .style('opacity', 0);

    d3.selectAll(`.link-source-${taskId}, .link-target-${taskId}`)
      .transition()
      .duration(200)
      .style('stroke', palette.info.main);
  };

  return {
    taskPositionAndWidth,
    progressPositionAndWidth,
    handleDragStart,
    handleResizeStart,
    getTaskProgressBG,
    onTaskMouseEnter,
    onTaskMouseLeave,
  };
};
