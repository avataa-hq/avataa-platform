import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const StyledSnackbarProvider = styled(Box)`
  .notistack-MuiContent {
    background-color: ${({ theme }) => theme.palette.background.default};
    box-shadow: ${({ theme }) => theme.shadows[10]};
    border-radius: 10px;
    padding: 10px;
  }

  .notistack-MuiContent #notistack-snackbar {
    color: ${({ theme }) => theme.palette.text.primary};
    font-weight: 400;
    padding: 0;
  }

  .notistack-MuiContent #notistack-snackbar svg {
    /* !important is necessary, as the default snackbar svg has inline style that needs to be overwritten */
    width: 1.5rem !important;
    height: 1.5rem !important;
  }

  .notistack-MuiContent-error #notistack-snackbar svg {
    color: ${({ theme }) => theme.palette.error.main};
  }

  .notistack-MuiContent-warning #notistack-snackbar svg {
    color: ${({ theme }) => theme.palette.warning.main};
  }

  .notistack-MuiContent-info #notistack-snackbar svg {
    color: ${({ theme }) => theme.palette.info.main};
  }

  .notistack-MuiContent-warning #notistack-snackbar svg {
    color: ${({ theme }) => theme.palette.warning.main};
  }

  .notistack-MuiContent-success #notistack-snackbar svg {
    color: ${({ theme }) => theme.palette.success.main};
  }
`;
