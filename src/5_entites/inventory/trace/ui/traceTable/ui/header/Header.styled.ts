import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const StyledHeader = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.palette.secondary.main};
`;
