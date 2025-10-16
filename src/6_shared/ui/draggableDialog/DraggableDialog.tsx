import React, { PropsWithChildren, ReactNode, useRef, useState } from 'react';
import Draggable, { ControlPosition } from 'react-draggable';
import {
  Box,
  Paper,
  PaperProps,
  SxProps,
  Typography,
  Slide,
  SlideProps,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import * as SC from './DraggableDialog.styled';

const Transition = React.forwardRef((props: SlideProps, ref) => {
  const theme = useTheme();

  return (
    <Slide
      direction="up"
      ref={ref}
      {...props}
      timeout={{
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.enteringScreen,
      }}
    />
  );
});

const PaperComponent = (props: PaperProps & { defaultPosition?: ControlPosition }) => {
  // const { draggable } = props;
  const paperRef = useRef<HTMLDivElement | null>(null);
  const { defaultPosition, ...rest } = props;

  return (
    <Draggable
      cancel=".DialogContent, .MuiDialogContent-root"
      bounds="parent"
      // bounds={(draggable as boolean) ? { left: 0, top: 0, right: 0, bottom: 0 } : 'parent'}
      nodeRef={paperRef}
      defaultPosition={defaultPosition}
    >
      <Paper
        {...rest}
        ref={paperRef}
        sx={{
          borderRadius: '20px',
        }}
      />
    </Draggable>
  );
};

interface IProps extends PropsWithChildren {
  open: boolean;
  onClose: () => void;
  title?: string | ReactNode;
  dialogContentSx?: SxProps;
  actions?: ReactNode;
  defaultPosition?: ControlPosition;
  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  minHeight?: string | number;
  mapPageAnimation?: boolean;
  draggable?: boolean;
  resizable?: boolean;
  disablePortal?: boolean;
}

export const DraggableDialog = ({
  open,
  onClose,
  title,
  dialogContentSx,
  actions,
  defaultPosition,
  children,
  width,
  height,
  minWidth,
  minHeight,
  mapPageAnimation,
  draggable = true,
  resizable = true,
  disablePortal = false,
}: IProps) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const theme = useTheme();

  const [newModalWidth, setNewModalWidth] = useState(width);
  const [newModalHeight, setNewModalHeight] = useState(height);
  // const [resizing, setResizing] = useState(false);

  const handleResize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // setResizing(true);

    const dialog = document.querySelector('.MuiDialog-paper') as HTMLElement;
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = parseFloat(getComputedStyle(dialog!).width);
    const startHeight = parseFloat(getComputedStyle(dialog!).height);

    const onMouseMove = (event: MouseEvent) => {
      const deltaX = event.clientX - startX;
      const newWidth = startWidth + deltaX;

      const deltaY = event.clientY - startY;
      const newHeight = startHeight + deltaY;

      // setNewModalWidth(newWidth);

      if (newWidth > 0) {
        setNewModalWidth(newWidth);
      }

      if (newHeight > 0) {
        setNewModalHeight(newHeight);
      }
    };

    const onMouseUp = () => {
      // setResizing(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const renderTitle = (titleToRender: string | ReactNode) => {
    if (typeof titleToRender === 'string')
      return (
        <Typography variant="h3" align="left">
          {titleToRender}
        </Typography>
      );

    return titleToRender;
  };

  const handleClose = (e: any) => {
    if (draggable && dialogRef.current && dialogRef.current.contains(e.target)) {
      return;
    }

    onClose();
  };

  return (
    <SC.DialogStyled
      ref={dialogRef}
      open={open}
      onClose={handleClose}
      disablePortal={disablePortal}
      PaperComponent={draggable ? PaperComponent : undefined}
      PaperProps={{
        defaultPosition,
      }}
      hideBackdrop={draggable}
      TransitionComponent={mapPageAnimation ? Transition : undefined}
      sx={{
        pointerEvents: draggable ? 'none' : 'auto',
        '.MuiDialog-paper': {
          pointerEvents: 'all',
          maxWidth: '100%',
          backgroundImage: 'none',
          overflow: 'visible',
          margin: 0,
        },
        '.MuiDialog-container': draggable ? {} : { cursor: 'auto' },
      }}
    >
      <SC.DraggableDialogStyled>
        <SC.DraggableWrapper sx={{ cursor: draggable ? 'move' : 'auto' }}>
          <SC.DialogContainer
            sx={{
              width: newModalWidth ?? 'max-content',
              height: newModalHeight ?? 'max-content',
              minWidth,
              minHeight,
              cursor: 'auto',
            }}
          >
            {title && (
              <Box component="div" mr="20px">
                {renderTitle(title)}
              </Box>
            )}
            <SC.DialogContent
              className="DialogContent"
              sx={{ overflow: 'auto', ...dialogContentSx }}
            >
              {children}
            </SC.DialogContent>

            {actions && (
              <SC.DialogFooterContainer>
                {/* <Box component="div" sx={{ flex: 1 }}> */}
                {actions}
                {/* </Box> */}
              </SC.DialogFooterContainer>
            )}
            <SC.DialogCloseButton onClick={() => onClose?.()}>
              <CloseIcon sx={{ fill: theme.palette.secondary.main }} />
            </SC.DialogCloseButton>
          </SC.DialogContainer>
        </SC.DraggableWrapper>

        {draggable && resizable && (
          <SC.ResizeButton onMouseDown={handleResize}>
            <OpenInFullIcon fontSize="small" />
          </SC.ResizeButton>
        )}
      </SC.DraggableDialogStyled>
    </SC.DialogStyled>
  );
};
