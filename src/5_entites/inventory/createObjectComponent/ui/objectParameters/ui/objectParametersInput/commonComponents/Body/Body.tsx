import { PropsWithChildren } from 'react';
import { Box } from '@mui/material';
import styled from '@emotion/styled';

const StyledBody = styled(Box)`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

export const Body = ({ children }: PropsWithChildren) => {
  return <StyledBody>{children}</StyledBody>;
};
