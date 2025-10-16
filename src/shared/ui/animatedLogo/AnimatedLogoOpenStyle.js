import styled from '@emotion/styled';
import { Box } from '@mui/material';

const AnimatedLogoStyle = styled(Box)`
  width: 110px;
  height: 36px;
  position: relative;
  cursor: pointer;

  .a1 {
    position: absolute;
    height: 16px;
    top: 10px;
    left: 9px;
  }

  .v2 {
    position: absolute;
    height: 16px;
    opacity: 0;
    top: 10px;
    left: 25px;
    animation: appearance 1s ease forwards 0.2s;
  }

  .a3 {
    position: absolute;
    height: 16px;
    opacity: 0;
    top: 10px;
    left: 42px;
    animation: appearance 1s ease forwards 0.3s;
  }

  .t4 {
    position: absolute;
    height: 16px;
    opacity: 0;
    top: 10px;
    left: 60px;
    animation: appearance 1s ease forwards 0.4s;
  }

  .a5 {
    position: absolute;
    height: 16px;
    opacity: 0;
    top: 10px;
    left: 68px;
    animation: appearance 1s ease forwards 0.5s;
  }

  .a6 {
    position: absolute;
    height: 16px;
    opacity: 0;
    top: 10px;
    left: 86px;
    animation: appearance 1s ease forwards 0.6s;
  }

  .l7 {
    position: absolute;
    height: 35px;
    transform: rotate(0deg);
    animation: logoRotate 1s ease forwards;
  }

  .l8 {
    position: absolute;
    height: 19px;
    left: 21px;
    top: 1px;
    transform: rotate(0deg);
    opacity: 1;
    animation: logoHide 0.1s forwards;
  }

  @keyframes appearance {
    33% {
      opacity: 0.3;
      transform: scale(90%);
    }
    66% {
      opacity: 0.6;
      transform: scale(110%);
    }
    100% {
      opacity: 1;
      transform: scale(100%);
    }
  }

  @keyframes logoRotate {
    to {
      transform: rotate(40deg);
    }
  }

  @keyframes logoHide {
    to {
      opacity: 0;
    }
  }
`;

export default AnimatedLogoStyle;
