import styled from '@emotion/styled';
import { alpha, Box } from '@mui/material';

export const DropContainer = styled(Box)<{ isfilevalid: 'true' | 'false' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border: 2px dashed grey;
  border-radius: 10px;
  /* margin-bottom: 20px; */
  cursor: default;
  user-select: none;
  background: ${({ isfilevalid, theme }) =>
    isfilevalid === 'true' ? '' : alpha(theme.palette.error.main, 0.1)};
  transition: background 1s;
`;
