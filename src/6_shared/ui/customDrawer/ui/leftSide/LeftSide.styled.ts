import styled from '@emotion/styled';
import { Box, IconButton } from '@mui/material';

export const LeftSideStyled = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  height: 100%;
  padding-top: 20px;
`;

export const IconButtonStyled = styled(IconButton)`
  width: 35px;
  height: 35px;
  & svg {
    transition: transform 250ms linear;
    &:hover,
    &:focus {
      transform: scale(1.1);
    }
  }
`;
