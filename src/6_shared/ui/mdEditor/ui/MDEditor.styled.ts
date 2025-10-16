import styled from '@emotion/styled';
import { alpha, Box } from '@mui/material';

export const MdEditorStyled = styled(Box)`
  display: flex;
  width: 100%;
  flex-direction: column;
  position: relative;
  padding: 5px;
  border-radius: 10px;
  overflow: visible;

  &:hover {
    background: ${({ theme }) => alpha(theme.palette.neutralVariant.outline, 0.3)};
  }

  & .w-md-editor {
    color: inherit;
    border-radius: 10px;
    white-space: pre-wrap;
    width: 100%;
    min-height: 150px;
    background: transparent;
    &-toolbar {
      background: ${({ theme }) => alpha(theme.palette.neutralVariant.outline, 0.3)};
      padding: 5px;
      & button {
        color: ${({ theme }) => (theme.palette.mode === 'light' ? 'black' : 'white')};
      }
    }
  }

  & ul {
    overflow-y: auto;
  }
`;

export const ActionButtonContainer = styled.div`
  display: flex;
  gap: 5px;
  position: absolute;
  bottom: -35px;
  right: 0;
  z-index: 2;
`;
