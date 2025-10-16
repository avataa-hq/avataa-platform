import {
  MultipleParameterUpdateBody,
  handleApiAction,
  parametersApi,
  useTranslate,
} from '6_shared';

export const useUpdateMultipleParameters = () => {
  const { useMultipleParameterUpdateMutation } = parametersApi;
  const translate = useTranslate();

  const [
    updateParameters,
    { isLoading: isMultipleUpdateParamsLoading, isSuccess: isMultipleUpdateParamsSuccess },
  ] = useMultipleParameterUpdateMutation();

  const updateMultipleParameters = async (
    body: MultipleParameterUpdateBody[],
    successMessageText?: string,
  ) => {
    const res = await handleApiAction(
      () => updateParameters(body).unwrap(),
      successMessageText ?? translate('Parameters updated successfully'),
    );

    return res;
  };

  return { updateMultipleParameters, isMultipleUpdateParamsLoading, isMultipleUpdateParamsSuccess };
};
