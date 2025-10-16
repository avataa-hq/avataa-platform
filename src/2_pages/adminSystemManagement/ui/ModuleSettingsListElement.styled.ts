import styled from '@emotion/styled';
import { Paper } from '@mui/material';

export const Card = styled(Paper)`
  border: 1px solid ${(props) => props.theme.palette.neutralVariant.outlineVariant};
  border-radius: 20px;
  background: ${(props) => props.theme.palette.neutral.surfaceContainerLowVariant1};
  padding: 20px;
  width: 100%;
  height: 100%;

  ::-webkit-scrollbar {
    width: 1px;
    background: transparent;
  }
`;
