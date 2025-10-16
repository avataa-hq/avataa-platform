import { enqueueSnackbar } from 'notistack';

import { getErrorMessage, useUpdateBatchOfParamTypesMutation } from '6_shared';

export const useTprmBatchUpdate = () => {
  const [batchUpdate, status] = useUpdateBatchOfParamTypesMutation();

  const updateBatchOfParamTypes = async (id: number, body: any) => {
    try {
      const response = await batchUpdate({ id, body }).unwrap();
      return response;
    } catch (error) {
      console.error(error);
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
      throw error;
    }
  };

  return [updateBatchOfParamTypes, status] as [typeof updateBatchOfParamTypes, typeof status];
};
