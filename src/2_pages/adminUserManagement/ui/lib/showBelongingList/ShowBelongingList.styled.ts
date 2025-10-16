import { Box } from '6_shared';
import styled from '@emotion/styled';
import { IconButton } from '@mui/material';

export const ListItemIconButton = styled(IconButton)`
  color: ${({ theme }) => theme.palette.neutralVariant.icon};
  cursor: pointer;
`;

export const ListItem = styled(Box)`
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
