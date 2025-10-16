import styled from '@emotion/styled';
import { InputBase } from '@mui/material';

export const InputStyled = styled(InputBase)`
  background-color: ${(props) => props.theme.palette.neutral.surfaceContainerLowestVariant2};
  border: 1px solid ${(props) => props.theme.palette.neutralVariant.outline};
  min-height: 24px;
  border-radius: 10px;
  padding: 0 10px;
  font-size: 0.75rem;
  width: 60%;
`;
