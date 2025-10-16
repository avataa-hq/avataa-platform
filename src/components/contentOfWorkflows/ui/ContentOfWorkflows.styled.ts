import styled from '@emotion/styled';
import { Box } from '6_shared';
import { alpha } from '@mui/system';

export const ContentOfWorkflowsStyled = styled(Box)`
  display: flex;
  height: 100%;
`;

export const SidebarHorContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 5%;
`;

export const DropContainer = styled(Box)<{ isfilevalid: 'true' | 'false' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border: 2px dashed grey;
  border-radius: 10px;
  cursor: default;
  user-select: none;
  background: ${({ isfilevalid, theme }) =>
    isfilevalid === 'true' ? '' : alpha(theme.palette.error.main, 0.1)};
  transition: background 1s;
`;
