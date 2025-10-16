import { enqueueSnackbar } from 'notistack';

import {
  UpdateBatchOfParamTypesBodyItem,
  getErrorMessage,
  useCheckBatchOfParamTypesUpdateMutation,
} from '6_shared';

export const useCheckTprmBatchUpdate = () => {
  const [checkBatchUpdate, status] = useCheckBatchOfParamTypesUpdateMutation();

  const checkTprmBatchUpdate = async (id: number, body: UpdateBatchOfParamTypesBodyItem[]) => {
    try {
      const response = await checkBatchUpdate({ id, body }).unwrap();
      return response;
    } catch (error) {
      console.error(error);
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
      throw error;
    }
  };

  return [checkTprmBatchUpdate, status] as [typeof checkTprmBatchUpdate, typeof status];
};
