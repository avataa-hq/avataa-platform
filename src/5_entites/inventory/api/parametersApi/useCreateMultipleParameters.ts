import {
  MultipleParameterUpdateBody,
  handleApiAction,
  parametersApi,
  useTranslate,
} from '6_shared';

export const useCreateMultipleParameters = () => {
  const { useMultipleParameterCreateMutation } = parametersApi;
  const translate = useTranslate();

  const [
    createParameters,
    { isLoading: isMultipleCreateParamsLoading, isSuccess: isMultipleCreateParamsSuccess },
  ] = useMultipleParameterCreateMutation();

  const createMultipleParameters = async (
    body: MultipleParameterUpdateBody[],
    successMessageText?: string,
  ) => {
    await handleApiAction(
      () => createParameters(body).unwrap(),
      successMessageText ?? translate('Parameters created successfully'),
    );
  };

  return { createMultipleParameters, isMultipleCreateParamsLoading, isMultipleCreateParamsSuccess };
};
