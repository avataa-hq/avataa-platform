import styled from '@emotion/styled';
import { Box, BoxProps } from '@mui/material';
import { PropsWithChildren } from 'react';

const Wrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

export const ComponentContent = ({ children, ...props }: PropsWithChildren<BoxProps>) => {
  return <Wrapper {...props}>{children}</Wrapper>;
};
