import styled from '@emotion/styled';
import { Box } from '@mui/material';

const controlContainerWidth = 45;

export const LeftPanelStyled = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
`;
export const LeftPanelContent = styled(Box)`
  width: calc(100% - ${controlContainerWidth}px);
  height: 100%;
`;
export const LeftPanelControl = styled(Box)`
  width: ${controlContainerWidth}px;
  height: 100%;

  padding-top: 40px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  gap: 20px;

  overflow-y: auto;
  overflow-x: hidden;

  border-left: 1px solid ${({ theme }) => theme.palette.neutralVariant.outline};
  border-right: 1px solid ${({ theme }) => theme.palette.neutralVariant.outline};

  z-index: 2;
`;
