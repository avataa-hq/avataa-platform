import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const ColoredLineChartStyled = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  gap: 1rem;
`;

export const Body = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 10px;
  max-height: 80%;
  max-width: 100%;
  overflow-y: auto;
  gap: 1rem;
`;

export const ColoredLineChartListItem = styled(Box)`
  display: flex;
  align-items: center;
  flex: 1;
  gap: 1rem;
`;
