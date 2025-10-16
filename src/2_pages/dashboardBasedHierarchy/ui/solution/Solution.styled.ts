import styled from '@emotion/styled';
import { Box } from '6_shared';

export const SolutionStyled = styled(Box)`
  width: 100%;
  height: 100%;
  animation: animation_emergence 0.5s forwards;

  @keyframes animation_emergence {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }
`;
