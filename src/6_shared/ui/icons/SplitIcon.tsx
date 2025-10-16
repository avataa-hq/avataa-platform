import { SvgIcon, SvgIconProps } from '@mui/material';

import SplitIconSvg from 'assets/icons/split.svg?react';

export const SplitIcon = (props: SvgIconProps) => (
  <SvgIcon component={SplitIconSvg} inheritViewBox {...props} />
);
