import styled from '@emotion/styled';
import { Box } from '6_shared';

export const NetworkMapStyled = styled(Box)`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  transition: all 0.3s;
  animation: animation_close_network 0.3s forwards;

  @keyframes animation_close_network {
    0% {
      transform: translateX(120%);
    }

    100% {
      transform: translateX(0);
    }
  }

  & .fullscreen {
    height: 100%;
    width: 100%;
  }
`;

export const MapNavigationContainer = styled(Box)`
  z-index: 4;
  position: absolute;
  top: 10px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
  padding: 10px;
  width: 100%;
`;

export const SearchAndLayersContainer = styled(Box)`
  display: flex;
  justify-content: end;
  align-items: center;
  width: 100%;
  height: 44px;
`;

export const MapContainer = styled(Box)`
  display: flex;
  min-width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
`;

export const MapSlideContainer = styled(Box)`
  position: relative;
  min-width: 100%;
  height: 100%;
  border-radius: 20px;
  //overflow: hidden;
  transition: all 0.3s;
  //animation: animation_appearance 0.3s forwards;
  //
  //@keyframes animation_appearance {
  //  0% {
  //    transform: translateX(120%);
  //  }
  //
  //  100% {
  //    transform: translateX(0);
  //  }
  //}
`;
