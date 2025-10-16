import styled from '@emotion/styled';
import { Delete } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

export const DeleteIconStyled = styled(Delete)`
  width: 20px;
  height: 20px;
  fill: ${({ theme }) => theme.palette.neutralVariant.icon};
`;

export const LoadingButtonStyled = styled(LoadingButton)`
  padding: 6px;
  min-width: 0;
`;
