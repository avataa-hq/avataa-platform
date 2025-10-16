import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { keyframes } from '@emotion/react';

const fadeInContent = () => keyframes`
  0% { transform: translateX(-100%); opacity: 0 }
  100% { transform: translateY(0); opacity: 1 }
`;

export const ContentContainerStyled = styled(Box)`
  width: 100%;
  height: 100%;
  padding: 10px 0;
  transform: translateY(0);
  opacity: 1;
  display: flex;
  flex-direction: column;
  //gap: 10px;
  animation: 0.3s ease-in forwards ${fadeInContent()};
  overflow: hidden;
`;

export const Header = styled(Box)`
  width: 100%;
  padding: 10px 10px;
  display: flex;
  flex-direction: column;
`;
export const Body = styled(Box)`
  width: 100%;
  height: 80%;
  overflow: auto;
`;
export const Footer = styled(Box)`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
