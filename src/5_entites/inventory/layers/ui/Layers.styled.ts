import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const LayersStyled = styled(Box)`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const Header = styled(Box)`
  width: 100%;
`;

export const Body = styled(Box)`
  width: 100%;
  height: 90%;
  overflow-y: auto;
`;

export const LoadingContainer = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;
