import { groupApi } from '6_shared';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';

const { useDeleteGroupTemplateMutation } = groupApi;

interface IProps {
  setIsOpenDialog?: (isOpen: boolean) => void;
}

export const useDeleteGroupTemplate = ({ setIsOpenDialog }: IProps) => {
  const [deleteTemplate, { isLoading, error, isSuccess, isError }] =
    useDeleteGroupTemplateMutation();

  const getErrorNotification = (message?: string) => {
    enqueueSnackbar(message ?? 'Error deleting template(s)', {
      variant: 'error',
      autoHideDuration: 2000,
    });
  };

  const getSuccessNotification = (message?: string) => {
    enqueueSnackbar(message ?? 'Template(s) successfully deleted', {
      variant: 'success',
      autoHideDuration: 2000,
    });
  };

  useEffect(() => {
    if (isLoading) return;
    if (error) {
      getErrorNotification();
    }
  }, [error, isLoading]);

  useEffect(() => {
    if (isLoading) return;

    if (isSuccess) {
      getSuccessNotification();
      setIsOpenDialog?.(false);
    }
  }, [isLoading, isSuccess]);

  const deleteGroupTemplate = async (tamplatesIds: number[]) => {
    await deleteTemplate(tamplatesIds);
  };

  return {
    deleteGroupTemplate,
    isLoadingDeleteGroupTemplate: isLoading,
    isSuccessDeleteGroupTemplateCreation: isSuccess,
    isErrorDeleteGroupTemplateCreation: isError,
  };
};
