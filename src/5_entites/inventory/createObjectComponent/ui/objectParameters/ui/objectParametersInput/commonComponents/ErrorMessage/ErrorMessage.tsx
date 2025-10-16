import styled from '@emotion/styled';
import { Typography, TypographyProps } from '@mui/material';
import { PropsWithChildren } from 'react';

const ErrorMessageStyled = styled(Typography)`
  position: absolute;
  bottom: -4px;
  left: 0;
  font-weight: 400;
  font-size: 0.5rem;
`;

export const ErrorMessage = ({ children, ...props }: PropsWithChildren<TypographyProps>) => {
  return <ErrorMessageStyled {...props}>{children}</ErrorMessageStyled>;
};
