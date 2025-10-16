import styled from '@emotion/styled';
import { Box, IconButton, IconButtonProps } from '@mui/material';

interface IProps extends IconButtonProps {
  selected?: boolean;
}

export const ListItemIconButton = styled(IconButton)<IProps>`
  /* color: ${({ theme }) => theme.palette.neutralVariant.icon}; */
  cursor: pointer;
  & svg {
    transform: scale(100%);
    transition: all 0.3s;
    fill: ${({ theme, selected }) => (selected ? theme.palette.primary.main : 'currentColor')};

    &:hover {
      transform: scale(110%);
    }
    &:active {
      transform: scale(95%);
    }
  }
`;

export const ListItem = styled(Box)`
  min-width: 300px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 2rem;
  flex-shrink: 0;
  transition: all 0.3s;
  animation: anim_container 0.7s forwards;

  @keyframes anim_container {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  &:hover {
    background: ${({ theme }) => `alpha(${theme.palette.primary.main}, 0.1)`};
  }
`;
