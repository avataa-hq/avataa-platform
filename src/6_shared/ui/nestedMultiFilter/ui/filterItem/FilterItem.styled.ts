import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const FilterItemStyled = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Container = styled(Box)`
  display: flex;
  width: 100%;
  gap: 10px;
`;

export const ContainerLeft = styled(Box)`
  display: flex;
  flex: 1;
  justify-content: end;
`;
export const ContainerRight = styled(Box)`
  display: flex;
  flex: 2;
  gap: 10px;
  justify-content: start;
`;
