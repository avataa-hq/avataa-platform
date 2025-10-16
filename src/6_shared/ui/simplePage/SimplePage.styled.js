import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';

export const PageContainerStyled = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const HeaderStyled = styled.header`
  height: 10%;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

export const BodyStyled = styled(Box)`
  flex: 1;
  padding: 0 1rem;
  display: flex;
  overflow-y: auto;
  justify-content: center;
`;

export const FooterStyled = styled.footer`
  display: flex;
  justify-content: space-around;
  margin: 1rem;
`;
