import styled from '@emotion/styled';
import { Replay } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

export const UpdateIconStyled = styled(Replay)`
  width: 20px;
  height: 20px;
  fill: ${({ theme }) => theme.palette.neutralVariant.icon};
`;

export const LoadingButtonStyled = styled(LoadingButton)`
  padding: 6px 8px;
  min-width: 0;
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
