import { Box } from '6_shared';
import styled from '@emotion/styled';

export const DataflowPageContainer = styled(Box)`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 1.25rem;
  overflow: hidden;
  display: flex;
  gap: 1.25rem;
  flex-direction: column;
  background-color: ${({ theme }) => theme.palette.neutral.surface};
`;
