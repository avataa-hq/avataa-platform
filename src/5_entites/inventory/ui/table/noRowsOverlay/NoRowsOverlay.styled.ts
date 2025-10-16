import styled from '@emotion/styled';
import { Box } from '@mui/system';

export const StyledGridOverlay = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${({ theme }) => theme.palette.primary.light};
`;

export const Label = styled(Box)`
  margin-top: 10px;
  font-size: 20px;
  font-weight: 800;
`;
