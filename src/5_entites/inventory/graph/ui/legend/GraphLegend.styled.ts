import styled from '@emotion/styled';
import { Box, alpha } from '@mui/material';
import isPropValid from '@emotion/is-prop-valid';

export const LegendNodeWrapper = styled(Box)`
  aspect-ratio: 1;
  height: 70px;
`;

export const LegendNodeContainer = styled(Box)`
  background-color: ${({ theme }) => theme.palette.neutral.surfaceContainerHigh};
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  gap: 3px;
  padding: 5px;
`;

export const LegendNodeExternalCircle = styled(Box, {
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== 'color',
})<{ color?: string }>`
  aspect-ratio: 1;
  border-radius: 50%;
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme, color }) =>
    color ? alpha(color, 0.3) : alpha(theme.palette.primary.main, 0.3)};
`;

export const LegendNodeInnerCircle = styled(Box, {
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== 'color',
})<{ color?: string }>`
  border-radius: 50%;
  width: 55%;
  height: 55%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme, color }) => color ?? theme.palette.primary.main};
`;

export const LegendNodeLabelContainer = styled(Box)`
  width: 100%;
  background-color: ${({ theme }) => theme.palette.background.paper};
  border-radius: 5px;
  padding: 3px;
  text-align: center;
`;

export const LegendLinkContainer = styled(Box)`
  background-color: ${({ theme }) => theme.palette.neutral.surfaceContainerHigh};
  border-radius: 5px;
  height: 20px;
  width: 70px;
  padding: 5px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LegendLinkIcon = styled(Box)`
  background-color: ${({ theme }) => theme.palette.primary.main};
  height: 15px;
  width: 15px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;
