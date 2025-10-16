import styled from '@emotion/styled';
import { Box } from '@mui/material';

const AnimatedLogoCloseStyle = styled(Box)`
  position: relative;
  height: 36px;
  cursor: pointer;

  .logo-close {
    height: 36px;
    transform: rotate(320deg);
    animation: logotypeRotate 1s ease forwards;
  }

  .a-close {
    position: absolute;
    height: 16px;
    top: 10px;
    left: 9px;
  }

  @keyframes logotypeRotate {
    to {
      transform: rotate(0deg);
    }
  }
`;

export default AnimatedLogoCloseStyle;
