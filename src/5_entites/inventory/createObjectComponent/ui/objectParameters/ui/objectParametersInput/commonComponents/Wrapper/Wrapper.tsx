import { Box, BoxProps, styled } from '@mui/material';
import { PropsWithChildren } from 'react';

const WrapperStyled = styled(Box)`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

export const Wrapper = ({ children, ...props }: PropsWithChildren<BoxProps>) => {
  return <WrapperStyled {...props}>{children}</WrapperStyled>;
};
