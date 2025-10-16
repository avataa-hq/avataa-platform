import styled from '@emotion/styled';
import { Box } from '6_shared';

export const ObjectCommentsStyled = styled(Box)`
  width: 100%;
  height: 100%;
  overflow: hidden;
  /* padding: 0 20px; */
  padding: 20px 20px 30px;
  display: flex;
  flex-direction: column;
`;

export const Header = styled(Box)`
  width: 100%;
`;

export const Body = styled(Box)`
  width: 100%;
  flex-grow: 1;
  overflow: hidden;
  border-radius: 10px;
  padding: 10px 0;
`;

export const Footer = styled(Box)`
  width: 100%;
`;

export const LoadingContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

export const CommentsErrorContent = styled(Box)`
  width: 100%;
  height: 68%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
