import isPropValid from '@emotion/is-prop-valid';
import styled from '@emotion/styled';
import { Box, BoxProps } from '@mui/material';

interface LegendContainerProps extends BoxProps {
  isOpen?: boolean;
  isLoading?: boolean;
}

export const LegendHeader = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const LegendBody = styled(Box)`
  transition: all 0.4s ease-in-out;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
`;

export const LegendContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isOpen' && prop !== 'isLoading' && isPropValid(prop),
})<LegendContainerProps>`
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 20px;

  padding: ${({ isOpen }) => (isOpen ? '20px' : 0)};
  width: ${({ isOpen }) => (isOpen ? '350px' : 'min-content')};
  max-height: ${({ isOpen }) => (isOpen ? '80vh' : 'auto')};
  transition: width 0.4s ease-in-out, max-height 0.4s ease-in-out, padding 0.2s ease-in-out;

  border: 1px solid ${({ theme }) => theme.palette.neutralVariant.outlineVariant};
  backdrop-filter: blur(50px);
  border-radius: 20px;
  background: ${({ theme }) => theme.palette.neutral.surfaceContainerLowestVariant1};
  cursor: move;
  pointer-events: all;

  ${LegendBody} {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    opacity: ${({ isLoading }) => (isLoading ? '0.5' : '1')};
  }
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

export const LegendItemContainer = styled(Box)`
  .MuiAccordionSummary-root {
    min-height: unset;
    padding: 0;
  }

  .MuiAccordionSummary-content {
    margin: 0;
    align-items: center;
    gap: 5px;
  }

  .MuiAccordionDetails-root {
    padding: 0;
  }

  .MuiAccordionSummary-root:not(:last-child) {
    margin-bottom: 10px;
  }
`;
