import styled from '@emotion/styled';
import { Box, BoxProps } from '@mui/material';
import { forwardRef } from 'react';

const CenteredBoxRoot = styled(Box)({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const CenteredBox = forwardRef(
  ({ component = 'div', children, ...props }: BoxProps, ref) => (
    <CenteredBoxRoot ref={ref} component={component} {...props}>
      {children}
    </CenteredBoxRoot>
  ),
);
