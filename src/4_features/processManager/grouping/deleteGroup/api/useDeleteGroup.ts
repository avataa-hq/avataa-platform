import { groupApi } from '6_shared';
import { useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';

const { useDeleteGroupMutation } = groupApi;

export const useDeleteGroup = () => {
  const [delGroup, { isError, isLoading, isSuccess, error, data }] = useDeleteGroupMutation();

  const deleteGroup = async (body: string[]) => {
    await delGroup(body);
  };

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar('Group deleted successfully', { variant: 'success' });
    }

    if (error) {
      enqueueSnackbar('Something went wrong when deleting group', { variant: 'warning' });
    }
  }, [isSuccess, error]);

  return {
    deleteGroup,
    deleteGroupResponseData: data,
    isLoadingDeleteGroup: isLoading,
    isSuccessDeleteGroup: isSuccess,
    isErrorDeleteGroup: isError,
  };
};
