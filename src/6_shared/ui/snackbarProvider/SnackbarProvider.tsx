import { CloseRounded } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import {
  closeSnackbar,
  SnackbarKey,
  SnackbarProvider as DefaultSnackbarProvider,
  SnackbarProviderProps,
} from 'notistack';
import { useCallback } from 'react';
import { StyledSnackbarProvider } from './SnackbarProvider.styled';

export const SnackbarProvider = ({ children, ...props }: SnackbarProviderProps) => {
  const getSnackbarAction = useCallback<(key: SnackbarKey) => React.ReactNode>((key) => {
    return (
      <IconButton onClick={() => closeSnackbar(key)}>
        <CloseRounded />
      </IconButton>
    );
  }, []);

  return (
    <StyledSnackbarProvider>
      <DefaultSnackbarProvider
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        action={getSnackbarAction}
        style={{ whiteSpace: 'pre-line' }}
        {...props}
      >
        {children}
      </DefaultSnackbarProvider>
    </StyledSnackbarProvider>
  );
};
