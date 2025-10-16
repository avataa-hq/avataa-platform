import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import cn from 'classnames';
import { PropsWithChildren } from 'react';
import MyModalFooter from './footer/MyModalFooter';
import MyModalStyled from './MyModal.styled';
import MyModalHeader from './MyModalHeader';

interface MyModalProps {
  open: boolean;
  handleClose: () => void;
  size?: 'small' | 'medium' | 'large';
  square?: boolean;
}

export const MyModal = ({
  open,
  handleClose,
  children,
  size,
  square,
}: PropsWithChildren<MyModalProps>) => (
  <MyModalStyled open={open} onClose={handleClose}>
    <div
      className={cn('content', [size], {
        square: !!square,
      })}
    >
      {children}
      <IconButton className="close_btn" onClick={() => handleClose()}>
        <CloseIcon sx={(theme) => ({ color: theme.palette.neutralVariant.icon })} />
      </IconButton>
    </div>
  </MyModalStyled>
);

MyModal.Header = MyModalHeader;
MyModal.Footer = MyModalFooter;
