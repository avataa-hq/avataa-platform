import styled from '@emotion/styled';
import { IconButton, alpha } from '@mui/material';

export const AddButton = styled(IconButton)`
  border-radius: 50%;
  width: 27px;
  min-width: 0;
  height: 27px;
  padding: 0;
  background-color: ${({ theme }) => alpha(theme.palette.primary.main, 0.1)};
  box-shadow: none;
`;
