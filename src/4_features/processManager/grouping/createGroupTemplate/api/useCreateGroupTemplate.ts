import { groupApi, IGroupTemplatesBody } from '6_shared';
import { useCallback, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';

const { useCreateGroupTemplateMutation } = groupApi;

interface IProps {
  setIsOpenDialog?: (isOpen: boolean) => void;
}

export const useCreateGroupTemplate = ({ setIsOpenDialog }: IProps) => {
  const [create, { isError, error, isLoading, isSuccess }] = useCreateGroupTemplateMutation();

  const getErrorNotification = (message?: string) => {
    enqueueSnackbar(message ?? 'Error creating group template', {
      variant: 'error',
      autoHideDuration: 2000,
    });
  };

  const getSuccessNotification = (message?: string) => {
    enqueueSnackbar(message ?? 'The group template was successfully created', {
      variant: 'success',
      autoHideDuration: 2000,
    });
  };

  const createTemplate = useCallback(
    async (body: IGroupTemplatesBody) => {
      await create(body);
    },
    [create],
  );

  useEffect(() => {
    if (isSuccess && !isLoading) {
      getSuccessNotification();
      setIsOpenDialog?.(false);
      return;
    }

    if (isError && error && !isLoading) {
      getErrorNotification();
    }
  }, [error, isError, isLoading, isSuccess]);
  return {
    createTemplate,
    isLoadingGroupTemplateCreation: isLoading,
    isSuccessGroupTemplateCreation: isSuccess,
  };
};
