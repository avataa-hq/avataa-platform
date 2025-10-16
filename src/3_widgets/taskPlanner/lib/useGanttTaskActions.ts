import { useCallback, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { IGanttTask, ILineRef } from '6_shared';

interface IProps {
  tasks?: IGanttTask[];
  setTasks?: (tasks: IGanttTask[]) => void;
  selectedTask?: IGanttTask | null;
  setSelectedTask?: (task: IGanttTask | null) => void;
  setIsRightPanelOpen?: (isOpen: boolean) => void;
}

export const useGanttTaskActions = ({
  tasks,
  setTasks,
  selectedTask,
  setSelectedTask,
  setIsRightPanelOpen,
}: IProps) => {
  const linesRef = useRef<ILineRef | null>(null);
  const lineTasksRef = useRef<IGanttTask[]>([]);
  const strarLineConnectionIdRef = useRef<{
    startConnectionId: string;
    side: 'start' | 'end';
  } | null>(null);

  const [expandedTaskItems, setExpandedTaskItems] = useState<string[]>([]);

  const handleUpdateTask = useCallback(
    (ganttTasks: IGanttTask[], taskId: string, newStart: Date, newEnd: Date) => {
      const newTasks = ganttTasks?.map((t) =>
        t.id.toString() === taskId.toString()
          ? { ...t, start: newStart, end: newEnd, progressStart: newStart, progressEnd: newEnd }
          : t,
      );
      // return getUpdatedProjectsTime(newTasks ?? []);
      return newTasks;
    },
    [],
  );

  const onUpdateTask = useCallback(
    (taskId: string, newStart: Date, newEnd: Date) => {
      const withCorrectProjectsDate = handleUpdateTask(tasks ?? [], taskId, newStart, newEnd);
      setTasks?.(withCorrectProjectsDate);
    },
    [handleUpdateTask, setTasks, tasks],
  );

  const onUpdateLineTasks = useCallback(
    (taskId: string, newStart: Date, newEnd: Date) => {
      const withCorrectProjectsDate = handleUpdateTask(
        lineTasksRef.current,
        taskId,
        newStart,
        newEnd,
      );
      lineTasksRef.current = withCorrectProjectsDate;
      linesRef?.current?.upadeLineTasks?.(withCorrectProjectsDate);
    },
    [handleUpdateTask],
  );

  const handleUpdateTaskDependecies = useCallback(
    (endConnectionTaskId: string, endConnectionSide: 'start' | 'end') => {
      if (!strarLineConnectionIdRef) return;
      const sourceTask = tasks?.find(
        (t) => t.id === strarLineConnectionIdRef.current?.startConnectionId,
      );
      const targetTask = tasks?.find((t) => t.id === endConnectionTaskId);
      if (!sourceTask || !targetTask) return;

      if (endConnectionSide === 'start') {
        setTasks?.(
          tasks?.map((t) =>
            t.id === targetTask.id
              ? { ...t, dependencies: [...(t.dependencies ?? []), sourceTask.id.toString()] }
              : t,
          ) ?? [],
        );
      }

      if (endConnectionSide === 'end') {
        setTasks?.(
          tasks?.map((t) =>
            t.id === sourceTask.id
              ? { ...t, dependencies: [...(t.dependencies ?? []), targetTask.id.toString()] }
              : t,
          ) ?? [],
        );
      }
    },
    [setTasks, tasks],
  );

  const onDeleteTaskDependency = useCallback(
    (sourceTaskId: string, targetTaskId: string) => {
      setTasks?.(
        tasks?.map((t) =>
          t.id === targetTaskId
            ? { ...t, dependencies: t.dependencies?.filter((id) => id !== sourceTaskId) }
            : t,
        ) ?? [],
      );
    },
    [setTasks, tasks],
  );

  const onTaskClick = useCallback(
    (task: IGanttTask) => {
      if (task.type === 'project') {
        setSelectedTask?.(null);
        if (expandedTaskItems.includes(String(task.id))) {
          setExpandedTaskItems((prev) => prev.filter((id) => id !== String(task.id)));
        } else {
          setExpandedTaskItems((prev) => [...prev, String(task.id)]);
          setIsRightPanelOpen?.(true);
        }
      }
      if (task.type === 'task') {
        if (selectedTask?.id === task.id) {
          setSelectedTask?.(null);
          setIsRightPanelOpen?.(false);
        } else {
          setSelectedTask?.(task);
          setIsRightPanelOpen?.(true);
        }
      }
    },
    [expandedTaskItems, selectedTask?.id, setSelectedTask, setIsRightPanelOpen],
  );

  const handleCreateTimeLineTask = useCallback(
    (newTask: IGanttTask) => {
      if (!tasks) return;
      const existingTask = tasks.find((t) => t.id === newTask.id);

      if (existingTask) {
        setTasks?.(tasks.map((t) => (t.id === newTask.id ? newTask : t)));
      }
    },
    [tasks, setTasks],
  );

  const handleCreateGanttTaskProject = useCallback(
    (projectName: string) => {
      if (!tasks) return;
      const ganttTask: IGanttTask = {
        id: uuid(),
        name: projectName,
        type: 'project',
        progress: 0,
      };

      setTasks?.([...tasks, ganttTask]);
    },
    [tasks, setTasks],
  );

  return {
    linesRef,
    lineTasksRef,
    strarLineConnectionIdRef,
    onUpdateTask,
    onUpdateLineTasks,
    handleUpdateTaskDependecies,
    onDeleteTaskDependency,
    onTaskClick,
    expandedTaskItems,
    setExpandedTaskItems,
    handleCreateTimeLineTask,
    handleCreateGanttTaskProject,
  };
};
