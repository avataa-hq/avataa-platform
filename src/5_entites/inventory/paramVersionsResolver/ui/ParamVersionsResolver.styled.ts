import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';

export const ParamVersionsResolverStyled = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Header = styled(Box)`
  width: 100%;
`;

export const Body = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
`;

export const Footer = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 10px;
`;

export const LeftContent = styled(Box)`
  width: 33%;
  padding: 0 10px;
  overflow-y: auto;
`;

export const MiddleContent = styled(Box)`
  width: 33%;
  padding: 0 10px;
  overflow-y: auto;
`;

export const RightContent = styled(Box)`
  width: 33%;
  padding: 0 10px;
  overflow-y: auto;
`;

export const Content = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  padding: 10px 0;
`;

export const ContentItem = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
`;

export const LoadingContainer = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TypographyStyled = styled(Typography)`
  overflow-wrap: anywhere;
  width: 45%;
`;

export const ButtonContainer = styled(Box)`
  width: 10%;
`;
