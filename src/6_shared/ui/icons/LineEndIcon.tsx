import { SvgIcon, SvgIconProps } from '@mui/material';

import LineEndIconSvg from 'assets/icons/line_end.svg?react';

export const LineEndIcon = (props: SvgIconProps) => (
  <SvgIcon component={LineEndIconSvg} inheritViewBox {...props} />
);
