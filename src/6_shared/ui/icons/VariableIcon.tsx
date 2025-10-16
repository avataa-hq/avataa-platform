import { SvgIcon, SvgIconProps } from '@mui/material';

import VariableIconSvg from 'assets/icons/variable.svg?react';

export const VariableIcon = (props: SvgIconProps) => (
  <SvgIcon component={VariableIconSvg} inheritViewBox {...props} />
);
