import { Box } from '6_shared';
import styled from '@emotion/styled';

export const PriorityStyled = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const PriorityHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  height: 10%;
`;

export const PriorityBody = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70%;
  width: 100%;
`;

export const PriorityBottom = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20%;
  width: 100%;
  overflow: hidden;
`;
