import { SvgIcon, SvgIconProps } from '@mui/material';

import ObjectGroupIconSvg from 'assets/icons/object_group.svg?react';

export const ObjectGroupIcon = (props: SvgIconProps) => (
  <SvgIcon component={ObjectGroupIconSvg} inheritViewBox {...props} />
);
