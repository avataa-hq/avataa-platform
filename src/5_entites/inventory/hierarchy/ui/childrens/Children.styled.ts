import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const ChildrenStyled = styled(Box)`
  scroll-behavior: smooth;
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  border-bottom: 1px solid ${(props) => props.theme.palette.neutral.surfaceContainer};
`;
