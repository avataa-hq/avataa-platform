import { SvgIcon, SvgIconProps } from '@mui/material';

import CubeTreeIconSvg from 'assets/icons/cube_tree.svg?react';

export const CubeTreeIcon = (props: SvgIconProps) => (
  <SvgIcon component={CubeTreeIconSvg} inheritViewBox {...props} />
);
