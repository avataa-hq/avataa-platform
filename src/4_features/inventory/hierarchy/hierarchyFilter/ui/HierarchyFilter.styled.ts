import styled from '@emotion/styled';
import { Box, Modal } from '@mui/material';

export const HierarchyFilterStyled = styled(Modal)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Content = styled(Box)`
  width: 800px;
  max-height: 600px;
  min-height: 200px;
  border-radius: 20px;
  padding: 20px;
  gap: 5%;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  background: ${({ theme }) => theme.palette.background.default};
`;

export const SelectedObjectTypeContainer = styled(Box)`
  width: 50%;
  height: 10%;
`;

export const FilterContainer = styled(Box)`
  width: 100%;
  height: 85%;
  max-height: 500px;
  overflow-y: auto;
`;
