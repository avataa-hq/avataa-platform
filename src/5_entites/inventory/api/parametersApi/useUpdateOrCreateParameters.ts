import {
  getErrorMessage,
  MultipleParameterUpdateBody,
  parametersApi,
  useTranslate,
} from '6_shared';
import { useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';

const { useMultipleParameterCreateMutation, useMultipleParameterUpdateMutation } = parametersApi;

export const useUpdateOrCreateParameters = () => {
  const translate = useTranslate();

  const [
    createParameters,
    {
      isLoading: isMultipleCreateParamsLoading,
      isSuccess: isMultipleCreateParamsSuccess,
      isError: isMultipleCreateParamsError,
      error,
    },
  ] = useMultipleParameterCreateMutation();
  const [
    updateParameters,
    {
      isLoading: isMultipleUpdateParamsLoading,
      isSuccess: isMultipleUpdateParamsSuccess,
      isError: isMultipleUpdateParamsError,
      error: errorUpdate,
    },
  ] = useMultipleParameterUpdateMutation();

  const updateOrCreateParameters = async (body: MultipleParameterUpdateBody[]) => {
    const updateBody: MultipleParameterUpdateBody[] = [];
    const createBody: MultipleParameterUpdateBody[] = [];

    body.forEach(({ new_values, object_id }) => {
      const create: MultipleParameterUpdateBody = { object_id, new_values: [] };
      const update: MultipleParameterUpdateBody = { object_id, new_values: [] };

      new_values.forEach((tprm) => {
        if (!tprm.version || tprm.version === 0) {
          create.new_values.push({
            tprm_id: tprm.tprm_id,
            new_value: tprm.new_value,
          });
        } else {
          update.new_values.push({
            tprm_id: tprm.tprm_id,
            new_value: tprm.new_value,
            version: tprm.version,
          });
        }
      });

      if (create.new_values.length) createBody.push(create);
      if (update.new_values.length) updateBody.push(update);
    });

    if (updateBody.length > 0) await updateParameters(updateBody);
    if (createBody.length > 0) await createParameters(createBody);
  };

  useEffect(() => {
    if (isMultipleUpdateParamsSuccess) {
      enqueueSnackbar(translate('Parameters updated successfully'));
    }
  }, [isMultipleUpdateParamsSuccess, translate]);
  useEffect(() => {
    if (isMultipleCreateParamsSuccess) {
      enqueueSnackbar(translate('Parameters created successfully'));
    }
  }, [isMultipleCreateParamsSuccess, translate]);

  useEffect(() => {
    if (isMultipleCreateParamsError) {
      enqueueSnackbar(getErrorMessage(error), {
        variant: 'error',
        anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
      });
    }
  }, [error, isMultipleCreateParamsError]);

  useEffect(() => {
    if (isMultipleUpdateParamsError) {
      enqueueSnackbar(getErrorMessage(errorUpdate), {
        variant: 'error',
        anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
      });
    }
  }, [errorUpdate, isMultipleUpdateParamsError]);

  return {
    updateOrCreateParameters,
    isLoadingMultipleParamsUpdateOrCreate:
      isMultipleCreateParamsLoading || isMultipleUpdateParamsLoading,
  };
};
