import styled from '@emotion/styled';
import { LoadingButton } from '@mui/lab';

export const LoadingButtonStyled = styled(LoadingButton)`
  border-radius: 50px;
  height: 37px;
`;

export const HiddenInput = styled.input`
  opacity: 0;
  height: 0;
  width: 0;
  line-height: 0;
  overflow: hidden;
  padding: 0;
  margin: 0;
`;
