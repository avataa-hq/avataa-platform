import { SvgIcon, SvgIconProps } from '@mui/material';

import DataIconSvg from 'assets/icons/data.svg?react';

export const DataIcon = (props: SvgIconProps) => (
  <SvgIcon component={DataIconSvg} inheritViewBox {...props} />
);
