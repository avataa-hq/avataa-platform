import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const KanbanBoardStyled = styled(Box)`
  width: 100%;
  height: 100%;
`;

export const KanbanBoardWrapper = styled(Box)`
  gap: 10px;
  border-radius: 10px;
  height: 100%;
  position: relative;
  overflow-x: auto;
  display: grid;
  grid-auto-rows: 40px 40px auto;
  scroll-initial-target: nearest;
`;

export const KanbanBoardHeader = styled(Box)`
  width: 100%;
  display: flex;
  gap: 10px;
  position: sticky;
  top: 0;
  z-index: 2;
  background-color: ${({ theme }) => theme.palette.neutral.surface};
`;

export const KanbanBoardHeaderStatus = styled(Box)`
  width: 100%;
  min-width: 240px;
  height: 40px;
  display: flex;
  gap: 10px;
  align-items: center;
  border-radius: 10px;
  padding: 10px;
  background-color: ${({ theme }) =>
    theme.palette.mode === 'light'
      ? theme.palette.common.white
      : theme.palette.neutral.surfaceContainerHigh};
  overflow: hidden;
`;

export const KanbanBoardBody = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

export const KanbanBoardColumnsWrapper = styled(Box)`
  width: 100%;
  height: 100%;
  gap: 10px;
  display: grid;
`;

export const KanbanBoardPriorityWrapper = styled(Box)`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 10px;
  background-color: ${({ theme }) =>
    theme.palette.mode === 'light'
      ? theme.palette.neutral.surface
      : theme.palette.background.default};
`;

export const IssuesCount = styled.span`
  font-size: 12px;
  font-weight: 400;
`;

export const TaskStatusCount = styled(Box)`
  width: 40px;
  height: 22px;
  background-color: ${({ theme }) => theme.palette.primary.main};
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.palette.common.white};
`;

export const KanbanErrorContainer = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
