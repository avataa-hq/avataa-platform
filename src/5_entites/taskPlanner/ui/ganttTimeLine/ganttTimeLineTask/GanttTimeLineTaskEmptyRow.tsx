import { alpha, useTheme } from '@mui/material';
import { GANT_ROW_HEIGHT } from '6_shared';
import { GanttTimeLineRowStyled } from './GanttTimeLineTask.styled';

interface IProps {
  tasksLength: number;
}

export const GanttTimeLineTaskEmptyRow = ({ tasksLength }: IProps) => {
  const { palette } = useTheme();

  return (
    <GanttTimeLineRowStyled
      style={{
        width: '100%',
        height: GANT_ROW_HEIGHT,
        backgroundColor: tasksLength % 2 === 0 ? 'transparent' : alpha(palette.primary.light, 0.1),
      }}
    />
  );
};
