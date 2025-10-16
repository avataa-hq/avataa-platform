import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const StreetViewStyled = styled(Box)`
  width: 100%;
  height: 100%;
  position: relative;
`;

export const PanoramaContainer = styled(Box)`
  width: 100%;
  height: 100%;
  z-index: 1;

  position: absolute;
  top: 0;
  left: 0;
`;
export const MapContainer = styled(Box)`
  z-index: 2;

  position: absolute;
  bottom: 20px;
  right: 70px;
  border-radius: 20px;
  overflow: hidden;
  opacity: 0.7;

  transition: all 0.3s;

  &:hover {
    opacity: 1;
    width: 50%;
    height: 50%;
    border-radius: 10px;
  }
`;
export const LoadingContainer = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const PinButtonContainer = styled(Box)`
  width: 100%;
  padding: 10px;
  display: flex;
  justify-content: end;
  align-items: center;
  z-index: 3;
`;

export const SearchContainer = styled(Box)`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
`;
