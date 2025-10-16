import styled from '@emotion/styled';
import { Box, Typography, alpha, IconButton } from '@mui/material';
import { OpenInFull, CloseFullscreen } from '@mui/icons-material';

export const Header = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`;

export const TitleContent = styled(Box)`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const RightSideTitle = styled(Typography)`
  font-size: 18px;
`;

export const IconButtonStyled = styled(IconButton)`
  width: 32px;
  height: 32px;
  transition: all 250ms linear;
  &:hover,
  &:focus {
    transform: scale(1.1);
  }

  &:hover > svg,
  &:focus > svg {
    fill: ${({ theme }) => alpha(theme.palette.primary.main, 0.4)};
  }

  &:disabled > svg {
    fill: ${({ theme }) => alpha(theme.palette.neutralVariant.icon, 0.4)};
  }
`;

export const IconsContent = styled(Box)`
  display: flex;
  align-items: center;
`;

export const OpenInFullStyled = styled(OpenInFull)`
  width: 1.125rem;
`;

export const CloseFullScreenStyled = styled(CloseFullscreen)`
  width: 1.125rem;
`;
