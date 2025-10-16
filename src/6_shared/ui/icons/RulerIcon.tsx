import { SvgIcon, SvgIconProps } from '@mui/material';

import RulerIconSvg from 'assets/icons/ruler.svg?react';

export const RulerIcon = (props: SvgIconProps) => (
  <SvgIcon component={RulerIconSvg} inheritViewBox {...props} />
);
