import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TaskPlannerWidget } from '3_widgets';
import { IGanttTask, ON_TASKS_LOAD, useRegistration, useTaskManager } from '6_shared';
import { TaskPlannerPageStyled } from './TaskPlannerPage.styled';
import { ChartShareTools } from './chartShareTools/ChartShareTools';
import { useGetTasksFromBpmn } from '../lib/buildingTaskFromBpmn/useGetTasksFromBpmn';

const TaskPlannerPage = () => {
  useRegistration('taskManager');
  const { ganttTasks, selectedProcess, selectedTask, setGanttTasks } = useTaskManager();

  const tasksRef = useRef<IGanttTask[]>(ganttTasks);
  const ganttChartRef = useRef<HTMLDivElement | null>(null);
  const [tasks, setTasks] = useState<IGanttTask[]>(ganttTasks);

  const {
    tasksFromBpmn,
    isLoadingGantt,
    projectName,
    userTaskData,
    refetchTasks,
    isRefetching,
    dateBordersRef,
  } = useGetTasksFromBpmn({
    selectedProcess,
  });

  const selectedTaskData = useMemo(() => {
    return userTaskData?.filter((task) => task.name === selectedTask?.id)?.[0];
  }, [selectedTask, userTaskData]);

  useEffect(() => {
    setTasks(tasksFromBpmn);
    tasksRef.current = tasksFromBpmn;

    return () => {
      setTasks([]);
      tasksRef.current = [];
    };
  }, [tasksFromBpmn]);

  useEffect(() => {
    setGanttTasks(tasks);
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent(ON_TASKS_LOAD));
    }, 500);
  }, [setGanttTasks, tasks]);

  const handleSetTasks = useCallback((newTasks: IGanttTask[]) => {
    setTasks(newTasks);
  }, []);

  const onAfterCompleteTask = useCallback(() => {
    refetchTasks();
  }, [refetchTasks]);

  return (
    <TaskPlannerPageStyled>
      <ChartShareTools
        ganttChartRef={ganttChartRef}
        refetchTasks={onAfterCompleteTask}
        isTaskRefetching={isRefetching}
      />
      <TaskPlannerWidget
        ganttChartRef={ganttChartRef}
        selectedTaskData={selectedTaskData}
        tasks={tasks}
        setTasks={handleSetTasks}
        tasksRef={tasksRef.current}
        isLoading={isLoadingGantt}
        projectName={projectName}
        onAfterCompleteTask={onAfterCompleteTask}
        dateBordersRef={dateBordersRef}
      />
    </TaskPlannerPageStyled>
  );
};
export default TaskPlannerPage;
