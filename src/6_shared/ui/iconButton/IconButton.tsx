import { IconButton as MuiIconButton, IconButtonProps as MuiIconButtonProps } from '@mui/material';

type IconButtonProps = MuiIconButtonProps;

export const IconButton = ({ children, ...props }: IconButtonProps) => {
  return <MuiIconButton {...props}>{children}</MuiIconButton>;
};
