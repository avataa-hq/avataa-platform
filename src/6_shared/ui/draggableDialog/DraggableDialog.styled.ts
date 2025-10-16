import styled from '@emotion/styled';
import { Box, Dialog, IconButton } from '@mui/material';

export const DialogStyled = styled(Dialog)`
  border: 1px solid ${(props) => props.theme.palette.neutralVariant.outlineVariant};
  cursor: move;
`;

export const ResizeButton = styled(IconButton)`
  position: absolute;
  bottom: -10px;
  right: -10px;
  transform: rotate(90deg);
  opacity: 0.1;
  transition: opacity 0.3s ease-in-out;
  width: 32px;
  height: 32px;
`;

export const DraggableDialogStyled = styled(Box)`
  position: relative;
  width: 100%;
  height: 100%;

  &:hover > ${ResizeButton} {
    opacity: 1;
    background-color: ${({ theme }) => theme.palette.action.hover};
  }
`;

export const DraggableWrapper = styled(Box)`
  width: 100%;
  height: 100%;
  /* cursor: move; */
  padding: 2px;
`;

export const DialogContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  /* border: 1px solid ${(props) => props.theme.palette.neutralVariant.outlineVariant}; */
  border-radius: 20px;
  background: ${(props) => props.theme.palette.neutral.surfaceContainerLowestVariant1};
  /* backdrop-filter: blur(50px); */
  padding: 1.25rem;
  gap: 1.25rem;
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
`;

export const DialogContent = styled(Box)`
  height: 100%;
`;

export const DialogCloseButton = styled(IconButton)`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 2;
  color: ${({ theme }) => theme.palette.neutralVariant.icon};
`;

export const DialogFooterContainer = styled(Box)`
  display: flex;
  justify-content: flex-end;
  gap: 0.625rem;
  width: 100%;
`;
