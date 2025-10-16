import styled from '@emotion/styled';
import { Box, alpha } from '@mui/material';

export const HistoryRightPanelCountStyled = styled(Box)`
  width: 37px;
  height: 22px;
  border-radius: 10px;
  background: ${({ theme }) => theme.palette.primary.main};
  padding: 3px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.palette.common.white};
  font-size: 12px;
  font-family: Montserrat;
  box-shadow: 0 2px 4px ${({ theme }) => alpha(theme.palette.primary.main, 0.6)};
`;
