import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const DashboardBasedHierarchyStyled = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  position: relative;
`;

export const RightArea = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  height: 100%;
  /* width: 50%; */
  transition: all 0.3s ease-in-out;
`;

export const LoadingContainer = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: rgba(52, 55, 62, 0.2);
  opacity: 0.5;
  scale: 200%;
`;
