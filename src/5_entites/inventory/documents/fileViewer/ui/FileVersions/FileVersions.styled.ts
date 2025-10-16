import styled from '@emotion/styled';
import { History } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

export const HistoryIconStyled = styled(History)`
  width: 20px;
  height: 20px;
  fill: ${({ theme }) => theme.palette.neutralVariant.icon};
`;

export const LoadingButtonStyled = styled(LoadingButton)`
  padding: 6px 8px;
  min-width: 0;
`;
