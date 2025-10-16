import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const ConnectivityDiagramStyled = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const HintContainer = styled(Box)`
  position: absolute;
  bottom: 10px;
  left: 10px;
  padding: 5px;
  background: white;
  font-size: 12px;
  opacity: 0.8;
`;
