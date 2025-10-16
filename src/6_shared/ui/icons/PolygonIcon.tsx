import { SvgIcon, SvgIconProps } from '@mui/material';

import PolygonIconSvg from 'assets/icons/polygon.svg?react';

export const PolygonIcon = (props: SvgIconProps) => (
  <SvgIcon component={PolygonIconSvg} inheritViewBox {...props} />
);
