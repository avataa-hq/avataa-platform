import { enqueueSnackbar } from 'notistack';

import { dataflowGroupsApi, getErrorMessage, useTranslate } from '6_shared';

const { useDeleteGroupMutation } = dataflowGroupsApi;

export const useDeleteGroup = () => {
  const translate = useTranslate();
  const [deleteGroup, status] = useDeleteGroupMutation();

  const deleteDataflowGroup = async (id?: number) => {
    try {
      if (!id) throw new Error('Group id is missing');

      await deleteGroup(id).unwrap();
      enqueueSnackbar({ variant: 'success', message: translate('Success') });
    } catch (error) {
      console.error(error);
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
      throw error;
    }
  };

  return [deleteDataflowGroup, status] as [typeof deleteDataflowGroup, typeof status];
};
