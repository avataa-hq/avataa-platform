import { SvgIcon, SvgIconProps } from '@mui/material';

import ExpandIconSvg from 'assets/icons/expand.svg?react';

export const ExpandIcon = (props: SvgIconProps) => (
  <SvgIcon component={ExpandIconSvg} inheritViewBox {...props} />
);
