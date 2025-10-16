import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const PointsTreeStyled = styled(Box)`
  background: ${({ theme }) => theme.palette.background.default};
  width: fit-content;
  max-height: 800px;
  min-width: 350px;
  padding: 10px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
`;
