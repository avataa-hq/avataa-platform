import { Typography } from '@mui/material';
import { memo, MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  GantScaleType,
  ICamundaUserTaskModel,
  IGanttTask,
  ITaskPlannerDatesBorders,
  useTaskManager,
  WEEK_DAY_WIDTH,
} from '6_shared';
import {
  Header,
  HeaderLeft,
  HeaderRight,
  TaskPlannerWidgetStyled,
} from './TaskPlannerWidget.styled';
import { ChartTools } from './chartTools/ChartTools';
import { GanttChart } from './ganttChart';

interface IProps {
  tasksRef?: IGanttTask[];
  tasks?: IGanttTask[];
  setTasks?: (tasks: IGanttTask[]) => void;
  isLoading?: boolean;
  ganttChartRef: React.MutableRefObject<HTMLDivElement | null>;
  projectName?: string;

  selectedTaskData?: ICamundaUserTaskModel;

  onAfterCompleteTask?: () => void;

  dateBordersRef?: MutableRefObject<ITaskPlannerDatesBorders>;
}

export const TaskPlannerWidget = memo(
  ({
    tasksRef,
    tasks,
    setTasks,
    isLoading,
    ganttChartRef,
    projectName,
    selectedTaskData,
    onAfterCompleteTask,

    dateBordersRef,
  }: IProps) => {
    const ganttChartContainerRef = useRef<{ scrollToToday: () => void }>(null);

    const { currentScale, selectedTask, setCurrentScale, setSelectedTask } = useTaskManager();

    const [dayScaleWidth, setDayScaleWidth] = useState(WEEK_DAY_WIDTH);

    const [filteredTasks, setFilteredTasks] = useState<IGanttTask[]>(tasks ?? []);

    useEffect(() => {
      setFilteredTasks(tasks ?? []);
    }, [tasks]);

    const onTodayClick = useCallback(() => {
      ganttChartContainerRef?.current?.scrollToToday();
    }, []);

    const handleSetCurrentScale = useCallback(
      (scale: GantScaleType) => setCurrentScale(scale),
      [setCurrentScale],
    );

    const handleSearchChange = (newSearchQuery: string | undefined) => {
      if (newSearchQuery?.trim() && newSearchQuery?.trim() !== ' ') {
        setFilteredTasks([]);
      }
      const filteredGanttTasks =
        tasks?.filter((task) =>
          task.name
            .toLowerCase()
            .includes(newSearchQuery ? newSearchQuery.trim().toLocaleLowerCase() : ''),
        ) ?? [];
      setFilteredTasks(filteredGanttTasks);
    };

    return (
      <TaskPlannerWidgetStyled>
        <Header>
          <HeaderLeft>
            <Typography variant="h2">{projectName}</Typography>
          </HeaderLeft>
          <HeaderRight>
            <ChartTools
              dayWidth={dayScaleWidth}
              setDayScaleWidth={setDayScaleWidth}
              currentScale={currentScale}
              setCurrentScale={handleSetCurrentScale}
              onTodayClick={onTodayClick}
              handleSearchChange={handleSearchChange}
            />
          </HeaderRight>
        </Header>

        <DndProvider backend={HTML5Backend}>
          <GanttChart
            dayScaleWidth={dayScaleWidth}
            ganttChartRef={ganttChartRef}
            ref={ganttChartContainerRef}
            currentScale={currentScale}
            tasksRef={tasksRef}
            setTasks={setTasks}
            tasks={filteredTasks}
            isLoading={isLoading}
            selectedTask={selectedTask}
            setSelectedTask={(task) => setSelectedTask(task)}
            selectedTaskData={selectedTaskData}
            onAfterCompleteTask={onAfterCompleteTask}
            dateBordersRef={dateBordersRef}
          />
        </DndProvider>
      </TaskPlannerWidgetStyled>
    );
  },
);
