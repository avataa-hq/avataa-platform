import styled from '@emotion/styled';
import { Box, BoxProps } from '@mui/material';

interface IMapWidgetStyledProps extends BoxProps {
  offset: string;
}

export const MapWidgetStyled = styled(Box)<IMapWidgetStyledProps>`
  width: 100%;
  height: 100%;

  display: flex;
  z-index: 2;

  background: transparent;

  transition: all 0.3s;
  transform: translateX(${({ offset }) => `${offset}%`});

  position: relative;
`;
export const MapSideContainer = styled(Box)`
  min-width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`;
