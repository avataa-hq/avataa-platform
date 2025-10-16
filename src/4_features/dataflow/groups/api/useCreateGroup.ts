import { enqueueSnackbar } from 'notistack';

import { dataflowGroupsApi, getErrorMessage, useTranslate } from '6_shared';
import { Group } from '6_shared/api/dataflowV3/types';

const { useCreateGroupMutation } = dataflowGroupsApi;

export const useCreateGroup = () => {
  const translate = useTranslate();
  const [createGroup, status] = useCreateGroupMutation();

  const createDataflowGroup = async (body: Omit<Group, 'id'>) => {
    try {
      await createGroup(body).unwrap();
      enqueueSnackbar({ variant: 'success', message: translate('Group created successfully') });
    } catch (error) {
      console.error(error);
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
      throw error;
    }
  };

  return [createDataflowGroup, status] as [typeof createDataflowGroup, typeof status];
};
