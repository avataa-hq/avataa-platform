import styled from '@emotion/styled';
import { Box, BoxProps } from '@mui/material';
import { PropsWithChildren } from 'react';

const WrapperStyled = styled(Box)`
  display: flex;
  align-items: flex-start;
  width: 100%;
`;

export const Wrapper = ({ children, ...props }: PropsWithChildren<BoxProps>) => {
  return <WrapperStyled {...props}>{children}</WrapperStyled>;
};
