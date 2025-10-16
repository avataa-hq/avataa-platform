import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const Content = styled(Box)`
  position: absolute;
  bottom: 10px;
  left: 10px;
  width: 500px;
  height: 300px;
  background: ${({ theme }) => theme.palette.background.default};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 30px;
  border-radius: 20px;
`;
export const Header = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 10%;
`;
export const Body = styled(Box)`
  width: 100%;
  height: 60%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

export const SliderContainer = styled(Box)`
  display: flex;
  width: 40%;
  flex-direction: column;
  gap: 10px;
  justify-content: start;
  text-align: center;
`;
export const Footer = styled(Box)`
  width: 100%;
  height: 15%;
  display: flex;
  justify-content: center;
`;
