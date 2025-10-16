import styled from '@emotion/styled';
import { Paper, Typography, ListItemText } from '@mui/material';
import { Box } from '6_shared';

export const PermissionsListStyled = styled(Box)`
  width: 100%;
  height: 100%;
`;

export const PermissionsListTitle = styled(Typography)`
  padding-bottom: 10px;
`;

export const PaperStyled = styled(Paper)`
  min-width: 400px;
  min-height: 350px;
  overflow: auto;
  border-radius: 10px;
  height: 90%;
`;

export const ListItemTextStyled = styled(ListItemText)`
  &.MuiListItemText-root > .MuiTypography-root {
    font-weight: 400;
  }
`;
