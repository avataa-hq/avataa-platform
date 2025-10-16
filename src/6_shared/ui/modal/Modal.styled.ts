import styled from '@emotion/styled';
import { Box, IconButton, Modal } from '@mui/material';

export const ModalWrapper = styled(Modal)`
  label: ModalWrapper;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalContainer = styled(Box)`
  label: ModalContainer;
  display: flex;
  flex-direction: column;
  border: 1px solid ${(props) => props.theme.palette.neutralVariant.outlineVariant};
  border-radius: 20px;
  background: ${(props) => props.theme.palette.neutral.surfaceContainerLowestVariant1};
  backdrop-filter: blur(50px);
  padding: 1.25rem;
  gap: 1.25rem;
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
`;

export const ModalContent = styled(Box)`
  label: ModalContent;
  //flex: 1;
  // TODO Убрал flex ибо не работало как надо
`;

export const ModalBackButton = styled(IconButton)`
  label: ModalBackButton;
  position: absolute;
  top: 0.5rem;
  right: 2.5rem;
  z-index: 2;
  color: ${({ theme }) => theme.palette.neutralVariant.icon};
`;

export const ModalCloseButton = styled(IconButton)`
  label: ModalCloseButton;
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 2;
  color: ${({ theme }) => theme.palette.neutralVariant.icon};
`;

export const ModalFooterContainer = styled(Box)`
  label: ModalFooterContainer;
  display: flex;
  gap: 0.625rem;
  width: 100%;
`;
