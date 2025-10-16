import { enqueueSnackbar } from 'notistack';

import { dataflowGroupsApi, getErrorMessage, useTranslate } from '6_shared';
import { Group } from '6_shared/api/dataflowV3/types';

const { usePatchGroupMutation } = dataflowGroupsApi;

export const useUpdateGroup = () => {
  const translate = useTranslate();
  const [patchGroup, status] = usePatchGroupMutation();

  const updateGroup = async (group: Group) => {
    try {
      await patchGroup(group).unwrap();
      enqueueSnackbar({ variant: 'success', message: translate('Group updated successfully') });
    } catch (error) {
      console.error(error);
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
      throw error;
    }
  };

  return [updateGroup, status] as [typeof updateGroup, typeof status];
};
