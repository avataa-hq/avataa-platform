import { alpha, Box, Typography, useTheme } from '@mui/material';
import { addDays, format } from 'date-fns';
import { CREATE_TASK_DURATION } from '6_shared';
import { GanttTimeLineTaskStyled } from '../ganttTimeLineTask/GanttTimeLineTask.styled';

interface IProps {
  hoveredPosition: number;
  dayWidth: number;
  timeLineStartDate: Date;
}

export const GanttTimeLineNewTask = ({ dayWidth, hoveredPosition, timeLineStartDate }: IProps) => {
  const { palette } = useTheme();
  return (
    <>
      <GanttTimeLineTaskStyled
        style={{
          position: 'absolute',
          left: hoveredPosition,
          width: CREATE_TASK_DURATION * dayWidth,
          height: '20px',
          background: 'rgba(100, 100, 255, 0.5)',
          borderRadius: '25px',
        }}
      />
      <Typography
        style={{
          position: 'absolute',
          left: hoveredPosition - 70,
          fontSize: '12px',
          color: palette.text.primary,
        }}
      >
        {timeLineStartDate &&
          format(addDays(timeLineStartDate, hoveredPosition / dayWidth), 'yyyy/MM/dd')}
      </Typography>
      <Typography
        style={{
          position: 'absolute',
          left: hoveredPosition + CREATE_TASK_DURATION * dayWidth + CREATE_TASK_DURATION,
          fontSize: '12px',
          color: palette.text.primary,
        }}
      >
        {timeLineStartDate &&
          format(
            addDays(timeLineStartDate, hoveredPosition / dayWidth + CREATE_TASK_DURATION),
            'yyyy/MM/dd',
          )}
      </Typography>
      <Box
        component="div"
        sx={{
          backgroundColor: alpha(palette.text.secondary, 0.3),
          padding: '0 4px',
          borderRadius: '5px',
          position: 'absolute',
          left: hoveredPosition + CREATE_TASK_DURATION * dayWidth + 80,
          color: palette.text.secondary,
        }}
      >
        <Typography variant="subtitle2">{`${CREATE_TASK_DURATION}d`}</Typography>
      </Box>
    </>
  );
};
