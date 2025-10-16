import { PropsWithChildren } from 'react';
import { IconButton, SxProps, Theme } from '@mui/material';

interface IProps extends PropsWithChildren {
  onClick: () => void;
  customSx?: SxProps<Theme>;
}

export const IconButtonStyled = ({ onClick, customSx, children }: IProps) => {
  return (
    <IconButton onClick={onClick} sx={{ width: '20px', height: '20px', ...customSx }}>
      {children}
    </IconButton>
  );
};
