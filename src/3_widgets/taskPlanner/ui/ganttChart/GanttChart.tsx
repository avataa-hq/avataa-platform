import {
  forwardRef,
  MutableRefObject,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  CompleteUserTask,
  GanttTaskContextMenu,
  GanttTaskList,
  GanttTimeLineTask,
} from '5_entites';
import { Box, Typography } from '@mui/material';
import {
  CustomDrawer,
  GantScaleType,
  ICamundaUserTaskModel,
  ICreateLineRef,
  IGanttTask,
  ITaskPlannerDatesBorders,
  LoadingAvataa,
  ON_TASKS_LOAD,
} from '6_shared';
import { useGanttTaskContextMenu } from '5_entites/taskPlanner/lib';
import { useGanttTaskActions, useGlobalProgress } from '3_widgets/taskPlanner/lib';
import { GanttTimeLineTaskEmptyRow } from '5_entites/taskPlanner/ui/ganttTimeLine/ganttTimeLineTask/GanttTimeLineTaskEmptyRow';
import {
  TasksContainer,
  GanttChartStyled,
  TaskListArea,
  TimeLineArea,
  GanttLoadingContainer,
} from './GanttChart.styled';
import { GanttChartHeader } from './ganttChartHeader/GanttChartHeader';
import { GantChartDividers } from './gantChartDividers/GantChartDividers';
import { TimeLineTaskConnection } from '../timeLineTaskConnection/TimeLineTaskConnection';
import { useGanttChart } from '../../lib/useGanttChart';
import { useScrollsSync } from '../../lib/useScrollsSync';
import { TodayLine } from './todayLine/TodayLine';

interface IProps {
  tasksRef?: IGanttTask[];
  tasks?: IGanttTask[];
  setTasks?: (tasks: IGanttTask[]) => void;
  currentScale: GantScaleType;
  isLoading?: boolean;

  selectedTaskData?: ICamundaUserTaskModel;

  selectedTask?: IGanttTask | null;
  setSelectedTask?: (task: IGanttTask | null) => void;
  ganttChartRef: React.MutableRefObject<HTMLDivElement | null>;
  dayScaleWidth: number;
  dateBordersRef?: MutableRefObject<ITaskPlannerDatesBorders>;

  onAfterCompleteTask?: () => void;
}

export const GanttChart = forwardRef(
  (
    {
      setTasks,
      tasks,
      tasksRef,
      currentScale,
      isLoading,
      selectedTask,
      dateBordersRef,

      selectedTaskData,

      setSelectedTask,
      ganttChartRef,
      dayScaleWidth,

      onAfterCompleteTask,
    }: IProps,
    ref,
  ) => {
    const timeLineHeaderRef = useRef<HTMLDivElement | null>(null);
    const taskListAreaRef = useRef<HTMLDivElement | null>(null);
    const timeLineAreaRef = useRef<HTMLDivElement | null>(null);
    const tasksContainerRef = useRef<HTMLDivElement | null>(null);

    const createLineRef = useRef<ICreateLineRef | null>(null);

    const [projectExpanded, setProjectExpanded] = useState(true);
    const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

    useEffect(() => {
      return () => {
        setSelectedTask?.(null);
        setIsRightPanelOpen(false);
      };
    }, []);

    const {
      activeTaskPosition,
      dividersList,
      todayPosition,
      // firstTaskScrollPosition,
      timeLineSegments,
      timeLineDateBorders,
      timeLineTotalWidth,
      headerProgressWidth,
    } = useGanttChart({
      currentScale,
      tasksRef,
      dayScaleWidth,
    });

    const {
      contextMenuPosition,
      handleCloseContextMenu,
      handleContextMenu,
      handleContextMenuItemClick,
    } = useGanttTaskContextMenu({ tasks, setTasks });

    const {
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
    } = useGanttTaskActions({
      tasks,
      setTasks,
      selectedTask,
      setSelectedTask,
      setIsRightPanelOpen,
    });

    const { onTimeLineScroll, syncHorizontalScroll, syncVerticalScroll, scrollToToday } =
      useScrollsSync({
        timeLineHeaderRef,
        taskListAreaRef,
        timeLineAreaRef,
        dayWidth: dayScaleWidth,
        timeLineStartDate: timeLineDateBorders?.timeLineStartDate,
        todayPosition,
        activeTaskPosition,
      });

    useEffect(() => {
      createLineRef.current = {
        strarLineConnectionIdRef,
        timeLineAreaRef: timeLineAreaRef.current,
      };
    }, [strarLineConnectionIdRef]);

    const filteredTasks = useMemo(() => {
      const newTasks =
        tasks?.filter((task) => {
          if (!task.project) return true;
          return expandedTaskItems.includes(task.project);
        }) ?? [];
      lineTasksRef.current = newTasks;
      linesRef.current?.upadeLineTasks(newTasks);
      return newTasks;
    }, [expandedTaskItems, lineTasksRef, linesRef, tasks]);

    const { globalProgressColorSegments, presentOfProgress } = useGlobalProgress({
      tasks,
      timeLineDateBorders,
      dayScaleWidth,
      dateBordersRef,
    });

    useImperativeHandle(ref, () => ({
      scrollToToday,
    }));

    const toggleProjectExpand = () => {
      setProjectExpanded(!projectExpanded);
    };

    useEffect(() => {
      window.addEventListener(ON_TASKS_LOAD, scrollToToday);
      return () => window.removeEventListener(ON_TASKS_LOAD, scrollToToday);
    }, [scrollToToday]);

    return (
      <GanttChartStyled ref={ganttChartRef} style={{ opacity: isLoading ? 0.9 : 1 }}>
        {isLoading && (
          <GanttLoadingContainer>
            <LoadingAvataa />
          </GanttLoadingContainer>
        )}
        {/* header */}
        <GanttChartHeader
          timeLineSegments={timeLineSegments}
          todayPosition={todayPosition}
          currentScale={currentScale}
          ref={timeLineHeaderRef}
          timeLineWidth={timeLineTotalWidth}
          onTimeLineHeaderScroll={onTimeLineScroll}
          globalProgressColorSegments={globalProgressColorSegments}
          toggleProjectExpand={toggleProjectExpand}
          projectExpanded={projectExpanded}
          headerProgressWidth={headerProgressWidth}
          presentOfProgress={presentOfProgress}
        />

        {/* tasks */}
        <TasksContainer>
          <TaskListArea ref={taskListAreaRef} onScroll={() => syncVerticalScroll('left')}>
            <GanttTaskList
              tasks={tasks}
              expandItems={expandedTaskItems}
              setExpandItems={setExpandedTaskItems}
              handleCreateGanttTaskProject={handleCreateGanttTaskProject}
              projectExpanded={projectExpanded}
            />
          </TaskListArea>
          <TimeLineArea
            id="timeLineArea"
            ref={timeLineAreaRef}
            onScroll={() => {
              syncVerticalScroll('right');
              syncHorizontalScroll();
            }}
          >
            <Box
              id="tasksContent"
              ref={tasksContainerRef}
              component="div"
              sx={{ width: timeLineTotalWidth, position: 'relative' }}
            >
              <TodayLine width={1} leftOffset={todayPosition} />
              <GantChartDividers dividersList={dividersList} />
              {projectExpanded &&
                filteredTasks?.map((t, idx) => (
                  <GanttTimeLineTask
                    key={t.id}
                    task={t}
                    dayWidth={dayScaleWidth}
                    timeLineStartDate={timeLineDateBorders?.timeLineStartDate}
                    updateTask={onUpdateTask}
                    onUpdateLineTasks={onUpdateLineTasks}
                    onTaskClick={onTaskClick}
                    taskIndex={idx}
                    selected={selectedTask?.id === t.id}
                    handleUpdateTaskDependecies={handleUpdateTaskDependecies}
                    createLineRef={createLineRef}
                    onContextMenu={handleContextMenu}
                    handleCreateTimeLineTask={handleCreateTimeLineTask}
                  />
                ))}

              <GanttTimeLineTaskEmptyRow tasksLength={filteredTasks?.length ?? 0} />

              {projectExpanded && (
                <TimeLineTaskConnection
                  ref={linesRef}
                  dayWidth={dayScaleWidth}
                  tasks={lineTasksRef.current ?? []}
                  startDate={timeLineDateBorders?.timeLineStartDate}
                  timeLineRef={timeLineAreaRef}
                  timeLineWidth={timeLineTotalWidth}
                  onDeleteTaskDependency={onDeleteTaskDependency}
                />
              )}
              <GanttTaskContextMenu
                handleClose={handleCloseContextMenu}
                menuPosition={contextMenuPosition}
                handleContextMenuItemClick={handleContextMenuItemClick}
              />
            </Box>
          </TimeLineArea>
        </TasksContainer>
        <CustomDrawer
          open={isRightPanelOpen}
          anchor="right"
          onClose={() => {
            setIsRightPanelOpen(false);
            setSelectedTask?.(null);
          }}
        >
          {selectedTaskData ? (
            <CompleteUserTask
              selectedUserTask={selectedTaskData}
              disableComplete={!selectedTask?.isActive}
              onAfterSubmit={() => {
                onAfterCompleteTask?.();
                setIsRightPanelOpen(false);
                setSelectedTask?.(null);
              }}
            />
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
              }}
            >
              <Typography>There is no data by selected task</Typography>
            </div>
          )}
        </CustomDrawer>
      </GanttChartStyled>
    );
  },
);
