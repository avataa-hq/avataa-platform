import styled from '@emotion/styled';
import { alpha, Box, IconButton, Typography, useTheme } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
  GANT_HEADER_PROGRESS_HEIGHT,
  GANT_HEADER_SCALE_HEIGHT,
  Progress,
  TASK_LIST_WIDTH,
} from '6_shared';

const GanttTaskListHeaderStyled = styled.div`
  width: ${TASK_LIST_WIDTH}px;
  flex-shrink: 0;
  height: 100%;
  border-radius: 5px;
  border-right: 1px solid ${({ theme }) => theme.palette.neutralVariant.outline};
  border-bottom: 1px solid ${({ theme }) => theme.palette.neutralVariant.outline};
`;
const TaskListHeaderTop = styled.div`
  padding: 5px 10px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: ${GANT_HEADER_SCALE_HEIGHT}px;
  background: ${({ theme }) => alpha(theme.palette.primary.light, 0.1)};
  border-radius: 5px 5px 0 0;
`;
const TaskListHeaderBottom = styled.div`
  height: ${GANT_HEADER_PROGRESS_HEIGHT}px;
  padding: 2%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

interface IProps {
  progressValue: number;
  toggleProjectExpand: () => void;
  projectExpanded: boolean;
}

export const GanttTaskListHeader = ({
  progressValue = 0,
  toggleProjectExpand,
  projectExpanded,
}: IProps) => {
  const { palette } = useTheme();

  return (
    <GanttTaskListHeaderStyled>
      <TaskListHeaderTop>
        <Typography>Release</Typography>
        <Typography>Progress</Typography>
      </TaskListHeaderTop>

      <Box
        component="div"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <IconButton size="small" onClick={toggleProjectExpand}>
          <KeyboardArrowRightIcon
            fontSize="small"
            sx={{
              transform: projectExpanded ? 'rotate(90deg)' : '',
              transition: '0.3s',
              fill: palette.text.primary,
            }}
          />
        </IconButton>
        <TaskListHeaderBottom>
          <Typography>Duration of the project</Typography>
          <Progress value={Math.min(progressValue, 100)} />
        </TaskListHeaderBottom>
      </Box>
    </GanttTaskListHeaderStyled>
  );
};
