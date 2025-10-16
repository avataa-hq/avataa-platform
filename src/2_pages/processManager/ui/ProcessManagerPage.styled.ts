import { Box } from '6_shared';
import styled from '@emotion/styled';

export const ProcessManagerContainer = styled(Box)`
  display: flex;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.palette.neutral.surface};
`;

export const MainView = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  gap: 0.625rem;
`;

export const MainViewBody = styled(Box)`
  width: 100%;
  /* height: 80%; */
  height: calc(100% - 158px);
  display: flex;
  flex-grow: 1;
`;

export const TableWrapper = styled(Box)`
  background-color: ${({ theme }) =>
    theme.palette.mode === 'light'
      ? theme.palette.background.default
      : theme.palette.background.paper};
  //opacity: 1;
  border-radius: 10px;
  padding-bottom: 10px;
  animation: table_wrapper_animation_appearance 0.3s ease-in-out;

  @keyframes table_wrapper_animation_appearance {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }
`;
