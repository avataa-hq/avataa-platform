import { SvgIcon, SvgIconProps } from '@mui/material';

import TextSelectJumpIconSvg from 'assets/icons/text_select_jump.svg?react';

export const TextSelectJumpIcon = (props: SvgIconProps) => (
  <SvgIcon component={TextSelectJumpIconSvg} inheritViewBox {...props} />
);
