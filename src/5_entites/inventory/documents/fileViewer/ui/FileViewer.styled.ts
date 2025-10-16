import styled from '@emotion/styled';
import { alpha, Box } from '@mui/material';

export const FileViewerStyled = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const Header = styled(Box)`
  width: 100%;
  /* background: ${(props) => alpha(props.theme.palette.neutral.surfaceContainer, 0.2)}; */
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

export const Body = styled(Box)`
  width: 100%;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 50px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 50px;
    background-color: ${({ theme }) => theme.palette.components.scrollBar.thumbBackground};
  }
`;

export const LoadingContainer = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
