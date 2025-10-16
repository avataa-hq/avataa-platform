import styled from '@emotion/styled';
import { FileDownloadOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

export const DownloadIconStyled = styled(FileDownloadOutlined)`
  width: 20px;
  height: 20px;
  fill: ${({ theme }) => theme.palette.neutralVariant.icon};
`;

export const LoadingButtonStyled = styled(LoadingButton)`
  padding: 6px 8px;
  min-width: 0;
`;
