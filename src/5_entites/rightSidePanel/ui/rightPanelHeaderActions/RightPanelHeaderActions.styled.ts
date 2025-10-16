import styled from '@emotion/styled';
import { alpha, IconButton } from '@mui/material';

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
