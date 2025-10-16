import styled from '@emotion/styled';
import { Box, BoxProps, Typography } from '@mui/material';

export const GanttTimeLineRowStyled = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 0;
  z-index: 2;
  position: relative;
  width: 100%;
`;

interface IGanttTimeLineTaskStyledProps extends BoxProps {
  selected?: boolean;
}

export const GanttTimeLineTaskStyled = styled(Box)<IGanttTimeLineTaskStyledProps>`
  position: relative;
  z-index: 3;
  cursor: grab;
  box-shadow: 0 15px 10px -8px ${({ selected }) => (selected ? `rgba(0, 0, 0, 1)` : `rgba(0, 0, 0, 0.35)`)};
`;

export const GanttTimeLineTaskProgress = styled(Typography)`
  position: absolute;
  top: -100%;
  left: 50%;
  transform: translateX(-50%);
  text-wrap: nowrap;
  opacity: 0.6;
`;

export const GanttTimeLineTaskProgressBar = styled(Box)`
  height: 50%;
  border-radius: 25px;
  position: absolute;
  top: 50%;
  box-shadow: -1px 8px 10px -4px rgba(0, 0, 0, 0.2);
`;

export const TaskNameContainer = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.4;
`;

export const NotCompletedTask = styled(Box)`
  position: absolute;
  top: 25%;
  height: 50%;
  width: 100%;
  border-radius: 25px;
  opacity: 1;
  background-color: transparent;
  z-index: 1;
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 25px;
    background: linear-gradient(
      to right,
      transparent,
      ${({ theme }) => theme.palette.primary.main},
      transparent
    );
    background-size: 200% 100%;
    animation: move-border 4s linear infinite;
    z-index: -1;
    mask: linear-gradient(#fff 0%, #fff 0) content-box, linear-gradient(#fff 0%, #fff 0);
    mask-composite: exclude;
    -webkit-mask-composite: destination-out;
    padding: 2px;
  }

  @keyframes move-border {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;
