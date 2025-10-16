import styled from '@emotion/styled';
import { alpha, Box } from '@mui/material';

export const BuildingPathHintStyle = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 10;
  background: ${(props) => props.theme.palette.background.default};
  border-radius: 10px;
  border: 3px solid ${(props) => alpha(props.theme.palette.neutralVariant.outline, 0.5)};
  box-shadow: 0 12px 20px -11px #0000008f;
  opacity: 0.9;
`;
export const Content = styled(Box)`
  width: 100%;
  height: 100%;
  max-width: 400px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
`;
export const HintIconContainer = styled(Box)`
  position: absolute;
  top: -20px;
  right: 0;
`;

export const HintMessageContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const HintMessageItem = styled(Box)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
`;
export const HintActions = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
`;
