import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const AdminMainPageContainer = styled(Box)`
  overflow-y: auto;
  height: 100%;
  padding: 1rem 1rem 0rem 1rem;
  opacity: 0;

  animation: opacityIncrease 2s forwards;

  @keyframes opacityIncrease {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 100;
    }
  }
`;
