import styled from '@emotion/styled';
import { alpha, Button } from '@mui/material';

export const ExpandButton = styled(Button)`
  min-width: 0;
  width: 50px;
  font-size: 12px;
  color: ${({ theme }) => alpha(theme.palette.text.primary, 0.3)};
  padding: 2px 30px;
`;
