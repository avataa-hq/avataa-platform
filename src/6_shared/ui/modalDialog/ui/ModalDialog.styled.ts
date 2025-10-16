import { Box } from '6_shared/ui/box';
import styled from '@emotion/styled';
import { Dialog, DialogTitle, IconButton } from '@mui/material';

export const ModalDialogStyled = styled(Dialog)`
  .MuiDialog-paper {
    padding: 0;
    box-shadow: 0 4px 20px ${({ theme }) => theme.shadows[8]};
    border-radius: 20px;
    overflow: hidden;
  }

  .MuiDialogContent-root {
    padding: 0;
    overflow: hidden;
    height: 93%;
    position: relative;
  }
`;

export const ResizeBar = styled(Box)`
  position: absolute;
  width: 100%;
  height: 10px;
  cursor: ns-resize;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;

  &:hover > button {
    opacity: 1;
  }
`;

export const ResizeButton = styled(IconButton)`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: all 250 linear;
  width: 36px;
  height: 36px;
`;

export const ModalDialogTopContent = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 7%;
`;

export const ModalDialogTitleContent = styled(Box)`
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const ModalCloseButtonStyled = styled(IconButton)`
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.palette.neutralVariant.icon};

  &:hover {
    color: ${({ theme }) => theme.palette.primary.dark};
  }
`;

export const ModalDialogTitleStyled = styled(DialogTitle)`
  padding: 0;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: ${(props) => props.theme.palette.text.primary};
`;
