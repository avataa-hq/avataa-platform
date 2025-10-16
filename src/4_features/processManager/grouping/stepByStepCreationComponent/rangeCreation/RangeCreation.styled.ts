import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const RangeCreationStyled = styled(Box)`
  width: 100%;
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
`;

export const BetweenContainer = styled(Box)`
  display: flex;
  align-items: center;
`;

export const Body = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
`;

export const BodyLeft = styled(Box)`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 5px;
`;

export const BodyRight = styled(Box)`
  display: flex;
  flex-direction: column;
  flex: 2;
  gap: 5px;
`;
