import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const EditMultipleParamsStyled = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

export const Header = styled(Box)`
  display: flex;
  align-items: center;
  gap: 42%;
`;

export const Body = styled(Box)`
  display: flex;
  align-items: center;
  flex-direction: column;
  flex-grow: 1;
  gap: 0.625rem;
  width: 100%;
  overflow: auto;
`;

export const Footer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
`;

export const ButtonsWrapper = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.625rem;
  width: 100%;
  overflow: hidden;
`;

export const LoadingContainer = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
