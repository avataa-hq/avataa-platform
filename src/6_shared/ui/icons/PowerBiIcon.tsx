import { SvgIcon, SvgIconProps } from '@mui/material';

import PowerBiIconSvg from 'assets/icons/power_bi.svg?react';

export const PowerBiIcon = (props: SvgIconProps) => (
  <SvgIcon component={PowerBiIconSvg} inheritViewBox {...props} />
);
