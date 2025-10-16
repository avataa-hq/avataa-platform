import styled from '@emotion/styled';
import { Typography, TypographyProps } from '@mui/material';
import { PropsWithChildren } from 'react';

const StyledSubText = styled(Typography)`
  color: ${({ theme }) => theme.palette.text.secondary};
  font-size: 12px;
  font-weight: 400;
`;

export const SubText = ({ children, ...props }: PropsWithChildren<TypographyProps>) => {
  return <StyledSubText {...props}>{children}</StyledSubText>;
};
