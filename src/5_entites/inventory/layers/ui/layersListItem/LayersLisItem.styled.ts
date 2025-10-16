import styled from '@emotion/styled';
import { Box, ListItem } from '@mui/material';

export const LayersListItemStyled = styled(ListItem)`
  .MuiListItemText-root {
    overflow: hidden;
  }

  :hover .action-buttons {
    opacity: 1;
    visibility: visible;
  }
`;

export const LayersButtonsWrapper = styled(Box)`
  display: flex;
  align-items: center;
  gap: 5px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease-in-out;
`;
