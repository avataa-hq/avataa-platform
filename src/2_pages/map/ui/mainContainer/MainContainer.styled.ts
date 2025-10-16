import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const MainContainerStyled = styled(Box)`
  width: 100%;
  height: 100%;
  padding: 20px;

  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const TopContainer = styled(Box)`
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TopContainerLeft = styled(Box)`
  display: flex;
`;

export const TopContainerRight = styled(Box)`
  display: flex;
`;

export const MapContainer = styled(Box)`
  width: 100%;
  height: 100%;

  position: absolute;
  top: 0;
  right: 0;

  z-index: 1;
`;
