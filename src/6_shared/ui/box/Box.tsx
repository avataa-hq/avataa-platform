import { forwardRef } from 'react';
import { Box as MUIBox, BoxProps } from '@mui/material';

export const Box = forwardRef(({ component, children, ...props }: BoxProps, ref) => (
  <MUIBox ref={ref} component="div" {...props}>
    {children}
  </MUIBox>
));
