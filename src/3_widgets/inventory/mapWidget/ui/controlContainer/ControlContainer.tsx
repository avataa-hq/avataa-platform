import styled from '@emotion/styled';
import { Box, SxProps, Theme } from '@mui/material';
import { PropsWithChildren } from 'react';

const ControlContainerStyled = styled(Box)`
  position: absolute;
  z-index: 1000;
`;

type Position =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'center-left'
  | 'center-right';

interface IProps extends PropsWithChildren {
  position?: Position;
  sx?: SxProps<Theme>;
}

export const ControlContainer = ({ children, position = 'bottom-right', sx }: IProps) => {
  const getPosition = (pos: Position) => {
    const padding = 20;
    if (pos === 'top-left') return { top: `${padding}px`, left: `${padding}px` };
    if (pos === 'top-right') return { top: `${padding}px`, right: `${padding}px` };
    if (pos === 'bottom-left') return { bottom: `${padding}px`, left: `${padding}px` };
    if (pos === 'bottom-right') return { bottom: `${padding}px`, right: `${padding}px` };
    if (pos === 'center-left') {
      return { top: `50%`, left: `${padding}px`, transform: 'translateX(-50%)' };
    }
    if (pos === 'center-right') {
      return { top: `50%`, right: `${padding}px`, transform: 'translateX(-50%)' };
    }
    return { top: `${padding}px`, left: `${padding}px` };
  };

  return (
    <ControlContainerStyled sx={{ ...getPosition(position), ...sx }}>
      {children}
    </ControlContainerStyled>
  );
};
