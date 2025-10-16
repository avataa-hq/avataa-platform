import { alpha, Tooltip, Typography, useTheme } from '@mui/material';
import { memo, useMemo } from 'react';
import { useCreateTimeLineTask } from '5_entites/taskPlanner/lib';
// import { isAfter } from 'date-fns';
import { GANT_ROW_HEIGHT, ICreateLineRef, IGanttTask } from '6_shared';
import {
  // ConnectionDot,
  GanttTimeLineRowStyled,
  GanttTimeLineTaskProgress,
  GanttTimeLineTaskProgressBar,
  GanttTimeLineTaskStyled,
  NotCompletedTask,
  // ResizeHandle,
  TaskNameContainer,
} from './GanttTimeLineTask.styled';
import { useTimeLineTask } from '../../../lib/useTimeLineTask';
import { GanttTaskTooltip } from '../ganttTaskTooltip/GanttTaskTooltip';
import { GanttTimeLineNewTask } from '../ganttTimeLineNewTask/GanttTimeLineNewTask';

import 'ldrs/react/Zoomies.css';

// Default values shown

interface IProps {
  task: IGanttTask;
  taskIndex: number;
  timeLineStartDate?: Date;
  dayWidth: number;
  updateTask: (taskId: string, newStart: Date, newEnd: Date) => void;
  onUpdateLineTasks: (taskId: string, newStart: Date, newEnd: Date) => void;
  onTaskClick?: (task: IGanttTask) => void;
  selected?: boolean;
  handleUpdateTaskDependecies: (endConnectionTaskId: string, side: 'start' | 'end') => void;
  createLineRef: React.MutableRefObject<ICreateLineRef | null>;
  onContextMenu: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleCreateTimeLineTask: (newTask: IGanttTask) => void;
}

export const GanttTimeLineTask = memo(
  ({
    task,
    taskIndex,
    timeLineStartDate,
    dayWidth,
    updateTask,
    onUpdateLineTasks,
    onTaskClick,
    selected,
    handleUpdateTaskDependecies,
    createLineRef,
    onContextMenu,
    handleCreateTimeLineTask,
  }: IProps) => {
    const { palette } = useTheme();

    const {
      handleResizeStart,
      progressPositionAndWidth,
      handleDragStart,
      taskPositionAndWidth,
      getTaskProgressBG,
      onTaskMouseEnter,
      onTaskMouseLeave,
    } = useTimeLineTask({
      updateTask,
      onUpdateLineTasks,
      task,
      dayWidth,
      timeLineStartDate,
    });

    // const { handleStartLineConnection, handleEndLineConnection } = useCreateLine({
    //   createLineRef,
    //   handleUpdateTaskDependecies,
    // });

    const {
      hoveredRowTaskPosition,
      handleRowMouseMove,
      handleRowMouseLeave,
      handleCreateTimeLineTaskClick,
    } = useCreateTimeLineTask({
      dayWidth,
      task,
      timeLineStartDate,
      handleCreateTimeLineTask,
    });

    const rowBackgroundColor = useMemo(() => {
      return taskIndex % 2 === 0 ? 'transparent' : alpha(palette.primary.light, 0.1);
    }, [taskIndex, palette.primary.light]);

    const { leftOffset, width } = taskPositionAndWidth;
    const { progressLeftOffset, progressWidth } = progressPositionAndWidth;

    const isMilestone = useMemo(() => task.type === 'milestone', [task.type]);
    const milestoneWidth = useMemo(() => (dayWidth > 60 ? dayWidth / 3 : dayWidth / 2), [dayWidth]);
    const milestoneOffset = useMemo(() => {
      if (task.nodeType === 'bpmn:endEvent') {
        return leftOffset + dayWidth - milestoneWidth / 2;
      }
      if (task.nodeType === 'bpmn:startEvent') {
        return leftOffset - milestoneWidth / 2;
      }

      return leftOffset + dayWidth / 2 - milestoneWidth / 2;
    }, [task, leftOffset, milestoneWidth, dayWidth]);

    return (
      <GanttTimeLineRowStyled
        style={{ height: GANT_ROW_HEIGHT, backgroundColor: rowBackgroundColor }}
        onMouseMove={handleRowMouseMove}
        onMouseLeave={handleRowMouseLeave}
        onClick={handleCreateTimeLineTaskClick}
      >
        {hoveredRowTaskPosition && !task.start && !task.end && timeLineStartDate && (
          <GanttTimeLineNewTask
            dayWidth={dayWidth}
            hoveredPosition={hoveredRowTaskPosition}
            timeLineStartDate={timeLineStartDate}
          />
        )}

        {task.start && task.end && (
          <Tooltip
            slotProps={{
              tooltip: { sx: { background: 'transparent' } },
            }}
            followCursor
            title={<GanttTaskTooltip task={task} />}
            enterDelay={1000}
            enterNextDelay={1000}
          >
            <GanttTimeLineTaskStyled
              id={`${task.id}`}
              selected={selected}
              sx={{
                width: isMilestone ? `${milestoneWidth}px` : width,
                height: isMilestone ? `${milestoneWidth}px` : '100%',
                // transform: `translateX(${leftOffset}px)`,
                transform: isMilestone
                  ? `translateX(${milestoneOffset}px) rotate(45deg)`
                  : `translateX(${leftOffset}px)`,
                background: isMilestone ? palette.warning.dark : palette.neutralVariant.icon,
                borderRadius: task.type === 'milestone' ? '5px' : '25px',
              }}
              draggable={task.type !== 'project'}
              // onDragStart={handleDragStart}
              onDragStart={(e) => e.preventDefault()}
              onClick={() => onTaskClick?.(task)}
              onContextMenu={onContextMenu}
              onMouseEnter={() => onTaskMouseEnter(task.id.toString())}
              onMouseLeave={() => onTaskMouseLeave(task.id.toString())}
            >
              <GanttTimeLineTaskProgress variant="subtitle1">
                {isMilestone ? '' : `${task.name}`}
              </GanttTimeLineTaskProgress>

              {task.start &&
                task.end &&
                task.progressEnd &&
                task.progressStart &&
                task.type !== 'milestone' && (
                  <GanttTimeLineTaskProgressBar
                    sx={{
                      width: progressWidth,
                      transform: `translateX(${progressLeftOffset}px) translateY(-50%)`,
                      background: `linear-gradient(90deg, ${getTaskProgressBG(
                        task.progressStart as Date,
                        task.progressEnd as Date,
                        task.start,
                        task.end,
                        task.isActive,
                      )} 0%, ${getTaskProgressBG(
                        task.progressStart as Date,
                        task.progressEnd as Date,
                        task.start,
                        task.end,
                        task.isActive,
                      )} 100%, ${palette.neutralVariant.icon} 100%)`,

                      // maskImage: !task.completed
                      //   ? `linear-gradient(to right, ${alpha(palette.common.black, 1)} 50%, ${alpha(
                      //       palette.common.black,
                      //       0.2,
                      //     )} 100%)`
                      //   : 'none',
                      // WebkitMaskImage: !task.completed
                      //   ? `linear-gradient(to right, ${alpha(palette.common.black, 1)} 50%, ${alpha(
                      //       palette.common.black,
                      //       0.2,
                      //     )} 100%)`
                      //   : 'none',
                    }}
                  />
                )}

              {task.start &&
                task.end &&
                task.progressEnd &&
                task.progressStart &&
                task.type !== 'milestone' &&
                task.isActive && (
                  <NotCompletedTask
                    style={{
                      width: progressWidth,
                      transform: `translateX(${progressLeftOffset}px)`,
                    }}
                  />
                )}

              {/* {task.type === 'task' && (
                <>
                  <ResizeHandle side="left" onMouseDown={handleResizeStart('left')} />
                  <ResizeHandle side="right" onMouseDown={handleResizeStart('right')} />
                </>
              )} */}

              {/* <ConnectionDot
                sx={{ left: '-15px' }}
                onMouseDown={(e) => {
                  handleStartLineConnection(e, task.id.toString(), 'start');
                }}
                onMouseUp={(e) => {
                  handleEndLineConnection(e, task.id.toString(), 'start');
                }}
              /> */}

              {/* <ConnectionDot
                sx={{ right: '-15px' }}
                onMouseDown={(e) => {
                  handleStartLineConnection(e, task.id.toString(), 'end');
                }}
                onMouseUp={(e) => handleEndLineConnection(e, task.id.toString(), 'end')}
              /> */}
            </GanttTimeLineTaskStyled>
          </Tooltip>
        )}

        {task.start && task.end && task.type === 'milestone' && (
          <TaskNameContainer
            style={{
              left:
                Math.max(leftOffset + width, progressLeftOffset + progressWidth) +
                progressWidth +
                20,
            }}
          >
            <Typography gutterBottom={false}>{task.name}</Typography>
          </TaskNameContainer>
        )}
      </GanttTimeLineRowStyled>
    );
  },
);
