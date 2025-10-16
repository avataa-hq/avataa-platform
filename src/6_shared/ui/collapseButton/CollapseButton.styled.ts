import styled from '@emotion/styled';
import { alpha, Button } from '@mui/material';

export const CollapseButtonStyled = styled(Button)<{ placement?: 'left' | 'right' }>`
  position: absolute;
  z-index: 466;
  top: 0;
  min-width: 0;
  padding: 0;
  width: 15px;
  height: 27px;
  border-radius: 0px;
  transition: all 0.3s;
  background: ${({ theme }) => alpha(theme.palette.primary.main, 0.1)};

  &.close {
    transform: ${({ placement }) =>
      placement === 'left' ? 'translateX(-100%)' : 'translateX(100%)'};
    transition: all 0.3s;
  }
`;
