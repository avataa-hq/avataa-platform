import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const TreeHierarchyStyled = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  height: 100%;
`;

export const LoadingStyled = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 20px;
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
`;
