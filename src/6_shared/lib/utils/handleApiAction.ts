import { enqueueSnackbar } from 'notistack';
import { getErrorMessage } from './getErrorMessage';

export const handleApiAction = async (apiAction: () => Promise<any>, successMessage?: string) => {
  try {
    const res = await apiAction();

    if (successMessage) {
      enqueueSnackbar(successMessage, {
        variant: 'success',
        anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
        autoHideDuration: 2000,
      });
    }
    return res;
  } catch (error) {
    enqueueSnackbar(getErrorMessage(error), {
      variant: 'error',
      anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
    });

    return error;
  }
};
