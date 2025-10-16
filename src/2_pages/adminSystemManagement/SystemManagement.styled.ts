import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const MainViewContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 1.25rem;
  position: relative;
`;

export const SystemManagementContainer = styled(Box)`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 0;
  background-color: ${({ theme }) => theme.palette.neutral.surface};
  /* overflow: hidden; */
`;

export const MainViewList = styled(Box)`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 1.25rem;
  overflow: auto;
`;
