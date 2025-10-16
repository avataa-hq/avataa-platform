import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const MainPageStyled = styled(Box)`
  width: 100%;
  height: 95%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  padding: 10px;
`;

export const Header = styled(Box)`
  display: flex;
  justify-content: space-evenly;
  //gap: 20px;
  align-items: center;
  width: 100%;
  height: 30%;
  min-height: 23%;
  overflow-x: auto;
  overflow-y: hidden;
`;

export const Body = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 40%;
`;

export const Footer = styled(Box)`
  width: 100%;
  height: 30%;
`;
