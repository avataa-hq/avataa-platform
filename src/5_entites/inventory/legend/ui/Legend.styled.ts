import styled from '@emotion/styled';
import { Box, BoxProps } from '@mui/material';

interface LegendStyledProps extends BoxProps {
  islegendopen?: 'true' | 'false';
  isloading?: 'true' | 'false';
}

export const LegendStyled = styled(Box)<LegendStyledProps>`
  position: absolute;
  bottom: 20px;
  /* right: 40px; */
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 20px;

  padding: ${(props) => (props.islegendopen === 'true' ? '20px' : 0)};
  width: ${(props) => (props.islegendopen === 'true' ? '400px' : 'min-content')};
  max-height: ${(props) => (props.islegendopen === 'true' ? '80vh' : 'auto')};
  transition: width 0.4s ease-in-out, max-height 0.4s ease-in-out, padding 0.2s ease-in-out;

  border: 1px solid ${(props) => props.theme.palette.neutralVariant.outlineVariant};
  backdrop-filter: blur(50px);
  border-radius: 20px;
  background: ${(props) => props.theme.palette.neutral.surfaceContainerLowestVariant1};
  cursor: move;
  pointer-events: all;
`;

export const LegendHeader = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const LegendBody = styled(Box)<LegendStyledProps>`
  display: ${(props) => (props.islegendopen === 'true' ? 'flex' : 'none')};
  opacity: ${(props) => (props.isloading === 'true' ? '0.5' : '1')};
  transition: all 0.4s ease-in-out;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  overflow-y: scroll;
`;

export const LoadingContainer = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 11;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Backdrop = styled(Box)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  pointer-events: none;
`;
