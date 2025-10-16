import styled from '@emotion/styled';
import { Box, BoxProps } from '@mui/material';

interface ParentsStyledProps extends BoxProps {
  parentslength?: number;
}

export const ParentsStyled = styled(Box)<ParentsStyledProps>`
  height: 160px;
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: ${({ parentslength }) =>
    parentslength && parentslength > 4 ? 'flex-start' : 'center'};
`;

export const BreadcrumbsStyled = styled(Box)`
  margin-left: 46px;
  opacity: 0;
  animation: breadcrumbs__anim 3s forwards;

  @keyframes breadcrumbs__anim {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 100;
    }
  }
`;
