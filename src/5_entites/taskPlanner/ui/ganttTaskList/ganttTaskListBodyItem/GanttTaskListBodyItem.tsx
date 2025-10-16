import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { Progress } from '6_shared';

const TaskListItemStyled = styled(Box)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TaskListItemLeft = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
`;

interface IProps {
  text: string;
  progressValue?: number;
  textWeight?: 'normal' | 'bold';
  icon?: ReactNode;
  height?: number;
  hovered?: boolean;
}

export const GanttTaskListBodyItem = ({
  height,
  hovered,
  icon,
  progressValue,
  text,
  textWeight,
}: IProps) => {
  return (
    <TaskListItemStyled
      sx={({ palette }) => ({
        height,
        background: hovered ? palette.neutralVariant.outline : 'transparent',
      })}
    >
      <TaskListItemLeft>
        {icon}
        <Typography fontSize={textWeight === 'normal' ? 14 : 16}>{text}</Typography>
      </TaskListItemLeft>
      {progressValue != null && (
        <div>
          <Progress value={progressValue} />
        </div>
      )}
    </TaskListItemStyled>
  );
};
