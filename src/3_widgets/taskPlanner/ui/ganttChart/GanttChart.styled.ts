import styled from '@emotion/styled';
import { TASK_LIST_WIDTH } from '6_shared';

export const GanttChartStyled = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;
export const TasksContainer = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden; /* у нас вертикальный скролл будет в каждой панели отдельно */
`;

export const TaskListArea = styled.div`
  width: ${TASK_LIST_WIDTH}px;
  flex-shrink: 0;
  border-right: 1px solid ${({ theme }) => theme.palette.neutralVariant.outline};
  overflow-y: auto;
  scrollbar-width: none;
`;

export const TimeLineArea = styled.div`
  flex: 1;
  min-width: 0; /* важно для flex */
  overflow-x: auto;
  overflow-y: auto;
  position: relative;
  scrollbar-color: ${({ theme }) => theme.palette.primary.main};
  /* ${({ theme }) => theme.palette.background.default}; */
  scrollbar-width: thin;
`;

export const GanttLoadingContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(50%, -50%);
  opacity: 0.5;
`;
