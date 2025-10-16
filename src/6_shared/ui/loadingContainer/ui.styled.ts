import { Box, BoxProps } from '@mui/material';
import styled from '@emotion/styled';

interface IProps extends BoxProps {
  blackout?: number; // 0-1
}

export const LoadingContainer = styled(Box)<IProps>`
  position: absolute;
  opacity: 0.7;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
  z-index: 777;
  background: rgba(32, 42, 54, ${({ blackout }) => (blackout != null ? String(blackout) : '0.1')});
  pointer-events: none;
`;
