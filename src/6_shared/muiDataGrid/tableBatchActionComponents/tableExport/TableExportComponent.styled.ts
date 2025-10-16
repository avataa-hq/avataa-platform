import { LoadingButton } from '@mui/lab';
import styled from '@emotion/styled';

export const CustomLoadingButton = styled(LoadingButton)`
  width: 40px;
  height: 40px;
  min-height: 0;
  min-width: 0;
  border-radius: 0.8rem;
  padding: 0;
  border-color: ${(props) => props.theme.palette.neutralVariant.outline};
  border-width: 1px;
  border-style: solid;
  background-color: ${(props) => props.theme.palette.background.default};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;
