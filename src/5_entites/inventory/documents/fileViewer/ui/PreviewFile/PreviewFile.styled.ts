import styled from '@emotion/styled';
import { Visibility } from '@mui/icons-material';
import { Box } from '@mui/material';

export const VisibilityIconStyled = styled(Visibility)`
  width: 20px;
  height: 20px;
  fill: ${({ theme }) => theme.palette.neutralVariant.icon};
`;

export const PreviewContent = styled(Box)`
  width: 100%;
  height: 100%;
`;
