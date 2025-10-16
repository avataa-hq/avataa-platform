import styled from '@emotion/styled';
import { alpha, Box, Typography } from '@mui/material';

export const KanbanBoardTaskCardStyled = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 5px;
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  min-height: 100px;
  max-height: 160px;
  background-color: ${({ theme }) =>
    theme.palette.mode === 'light'
      ? theme.palette.common.white
      : alpha(theme.palette.neutral.surface, 0.5)};
  cursor: pointer;
`;

export const CardMiddleContent = styled(Box)`
  display: flex;
  gap: 5px;
  width: 100%;
`;

export const CardMiddleLeftContent = styled(Box)`
  flex: 1;
`;

export const CardMiddleRightContent = styled(Box)``;

export const CardMiddleText = styled(Typography)`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 400;
`;

export const CardBottomContent = styled(Box)`
  display: flex;
  width: 100%;
`;

export const CardInfoContent = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
`;

export const CardDaysInColumn = styled(Box)`
  width: 8px;
  height: 8px;
  border-radius: 50%;
`;

export const InsertLine = styled.div`
  height: 4px;
  background-color: ${({ theme }) => theme.palette.primary.main};
  margin: 4px 0;
`;

export const CardParentNameWrapper = styled(Box)`
  background-color: ${({ theme }) => alpha(theme.palette.primary.main, 0.1)};
  color: ${({ theme }) => theme.palette.primary.main};
  border-radius: 10px;
  padding: 2px 10px;
  margin-top: 5px;
`;

export const CardTaskName = styled(Typography)`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
`;

export const CardTaskParentName = styled(Typography)`
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CardUserWrapper = styled(Box)`
  position: relative;
  border-radius: 50%;
  background-color: #ccc;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease-in-out;

  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 50%;
    border: 3px solid transparent;
    transition: border-color 0.2s ease-in-out;
  }

  &:hover::after {
    border-color: ${({ theme }) => alpha(theme.palette.primary.main, 0.5)};
  }
`;
