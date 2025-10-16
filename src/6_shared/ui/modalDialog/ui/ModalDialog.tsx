import React, { FC, ReactNode, useRef, useState } from 'react';
import { Box, DialogContent, Paper, PaperProps } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import Draggable from 'react-draggable';

import {
  ModalCloseButtonStyled,
  ModalDialogStyled,
  ModalDialogTitleContent,
  ModalDialogTitleStyled,
  ModalDialogTopContent,
  ResizeButton,
  ResizeBar,
} from './ModalDialog.styled';

const PaperComponent = (props: PaperProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const paperRef = useRef<HTMLDivElement | null>(null);

  const onStart = () => {
    setIsDragging(true);
  };

  const onStop = () => {
    setIsDragging(false);
  };
  return (
    <Draggable
      cancel=".DialogContent, .MuiDialogContent-root"
      bounds="parent"
      onStart={onStart}
      onStop={onStop}
      nodeRef={paperRef}
    >
      <Paper
        {...props}
        ref={paperRef}
        sx={{
          transition: isDragging ? 'none' : 'all 0.3s',
        }}
      />
    </Draggable>
  );
};

interface IModalDialog {
  modalTitle: string;
  isModalOpen: boolean;
  handleModalClose: () => void;
  children: ReactNode;
  maxWidth?: any;
  overflowY?: string;
  titleContent?: ReactNode;
  isFullScreen?: boolean;
  draggable?: boolean;
}

const ModalDialog: FC<IModalDialog> = ({
  modalTitle = 'Object name',
  isModalOpen,
  handleModalClose,
  children,
  maxWidth,
  overflowY = 'scroll',
  titleContent,
  isFullScreen = false,
  draggable = false,
}) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [newModalHeight, setNewModalHeight] = useState(570);

  const handleResize = (e: React.MouseEvent) => {
    e.preventDefault();

    const dialog = document.querySelector('.MuiDialog-paper') as HTMLElement;
    const startY = e.clientY;
    const startHeight = parseFloat(getComputedStyle(dialog!).height);

    const onMouseMove = (event: MouseEvent) => {
      const deltaY = event.clientY - startY;
      const newHeight = startHeight + deltaY;

      if (newHeight > 0) {
        setNewModalHeight(newHeight);
      }
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleClick = (e: any) => {
    if (dialogRef.current && dialogRef.current.contains(e.target)) {
      return;
    }

    handleModalClose();
  };

  return (
    <ModalDialogStyled
      ref={dialogRef}
      PaperComponent={draggable ? PaperComponent : undefined}
      hideBackdrop={draggable}
      open={isModalOpen}
      onClose={draggable ? handleClick : handleModalClose}
      maxWidth={maxWidth}
      sx={{
        pointerEvents: draggable ? 'none' : 'all',
        overflowY,
        '.MuiDialog-paper': {
          transition: draggable ? 'auto' : 'all 0.3s',
          width: isFullScreen ? '100%' : 'auto',
          // height: isFullScreen ? '100%' : '55%',
          height: isFullScreen ? '100%' : `${newModalHeight}px`,
          margin: isFullScreen ? '10px' : '32px',
          maxHeight: isFullScreen ? 'calc(100% - 20px)' : 'calc(100% - 64px);',
          minHeight: '570px',
          minWidth: '900px',
          pointerEvents: 'all',
        },
      }}
    >
      {draggable && <Box component="div" sx={{ width: '100%', height: '3px', cursor: 'move' }} />}
      <Box component="div" sx={{ height: '100%', paddingTop: isFullScreen ? 0 : '20px' }}>
        <ModalDialogTopContent sx={{ padding: isFullScreen ? '20px 20px 0' : '20px' }}>
          <ModalDialogTitleStyled>{modalTitle}</ModalDialogTitleStyled>
          <ModalDialogTitleContent className="DialogContent">
            {titleContent}
            <ModalCloseButtonStyled className="close_btn" onClick={handleModalClose}>
              <CloseIcon />
            </ModalCloseButtonStyled>
          </ModalDialogTitleContent>
        </ModalDialogTopContent>
        <DialogContent className="DialogContent">{children}</DialogContent>
        <ResizeBar onMouseDown={handleResize}>
          <ResizeButton color="primary">
            <UnfoldMoreIcon color="primary" />
          </ResizeButton>
        </ResizeBar>
      </Box>
    </ModalDialogStyled>
  );
};

export default ModalDialog;
