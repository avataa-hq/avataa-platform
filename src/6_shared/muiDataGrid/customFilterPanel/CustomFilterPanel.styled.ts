import styled from '@emotion/styled';
import { alpha } from '@mui/material';

export const CustomFilterPanelStyled = styled.div`
  width: 600px;
  max-height: 400px;
  background: ${({ theme }) => alpha(theme.palette.background.default, 0.6)};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
export const Body = styled.div`
  width: 100%;
  overflow: hidden;
`;
