import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const GanttTaskTooltipStyled = styled(Box)`
  opacity: 1;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1500;
  background: ${({ theme }) => theme.palette.background.default};
  padding: 10px;
  color: ${({ theme }) => theme.palette.text.primary};
  box-shadow: -10px 15px 10px -10px rgba(0, 0, 0, 0.3);
`;

export const TooltipRow = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

export const TooltipCellLeft = styled(Box)`
  width: 70%;
`;
export const TooltipCellRight = styled(Box)`
  flex: 1;
  width: 30%;
`;
