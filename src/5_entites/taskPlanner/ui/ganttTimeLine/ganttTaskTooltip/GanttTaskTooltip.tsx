import { Typography } from '@mui/material';
import { useMemo } from 'react';
import { differenceInMinutes, format } from 'date-fns';
import { IGanttTask } from '6_shared';
import {
  GanttTaskTooltipStyled,
  TooltipCellLeft,
  TooltipCellRight,
  TooltipRow,
} from './GanttTaskTooltip.styled';

const getDurationString = (start?: Date | string, end?: Date | string) => {
  if (!start || !end) return '';

  const startDate = new Date(typeof start === 'string' ? Date.parse(start) : start);
  const endDate = new Date(typeof end === 'string' ? Date.parse(end) : end);

  const totalMinutes = differenceInMinutes(endDate, startDate);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  return [
    days > 0 ? `${days} day(s)` : '',
    hours > 0 ? `${hours} hour(s)` : '',
    minutes > 0 ? `${minutes} minute(s)` : '',
  ]
    .filter(Boolean)
    .join(' ');
};

interface IProps {
  task: IGanttTask;
}

export const GanttTaskTooltip = ({ task }: IProps) => {
  // const durations = useMemo(() => {
  //   const { start, end, progressStart, progressEnd } = task;

  //   let taskDayDuration = 0;
  //   let progressDayDuration: number | null = null;

  //   if (!start || !end) return { taskDayDuration, progressDayDuration };

  //   taskDayDuration = differenceInDays(end, start) + 1;
  //   if (progressEnd && progressStart) {
  //     progressDayDuration = differenceInDays(new Date(progressEnd), new Date(progressStart)) + 1;
  //   }

  //   return { taskDayDuration, progressDayDuration };
  // }, [task]);

  const taskDuration = useMemo(() => getDurationString(task.start, task.end), [task]);
  const progressDuration = useMemo(
    () => getDurationString(task.progressStart, task.progressEnd ?? new Date()),
    [task],
  );

  return (
    <GanttTaskTooltipStyled>
      <Typography variant="h6" gutterBottom={false}>
        {task.name}
      </Typography>
      <TooltipRow>
        <TooltipCellLeft>
          {task.start && task.end && (
            <>
              <Typography>
                {format(task.start, 'yyyy-MM-dd HH:mm:ss')} -{' '}
                {format(task.end, 'yyyy-MM-dd HH:mm:ss')}
              </Typography>
              <Typography>{`${task.type !== 'milestone' ? taskDuration : ''}`}</Typography>
            </>
          )}
        </TooltipCellLeft>
        {/* <TooltipCellRight>
          <Typography variant="body2">{`${
            task.type !== 'milestone' ? taskDuration : '0 min'
          }`}</Typography>
        </TooltipCellRight> */}
      </TooltipRow>
      {task.type !== 'milestone' && (
        <>
          {task.progressStart && task.progressEnd && (
            <>
              <Typography gutterBottom={false}>Progress duration:</Typography>
              <TooltipRow>
                <TooltipCellLeft>
                  <Typography>
                    {format(new Date(task.progressStart!), 'yyyy-MM-dd HH:mm:ss')} -{' '}
                    {format(new Date(task.progressEnd!), 'yyyy-MM-dd HH:mm:ss')}
                  </Typography>
                  <Typography>{`${progressDuration}`}</Typography>
                </TooltipCellLeft>
                {/* <TooltipCellRight>
                  <Typography variant="body2">{`${progressDuration}`}</Typography>
                </TooltipCellRight> */}
              </TooltipRow>
            </>
          )}
          <TooltipRow>
            <TooltipCellLeft>
              <Typography>Active:</Typography>
            </TooltipCellLeft>
            <TooltipCellRight>
              <Typography>{task.isActive ? 'Yes' : 'No'}</Typography>
            </TooltipCellRight>
          </TooltipRow>
        </>
      )}
    </GanttTaskTooltipStyled>
  );
};
