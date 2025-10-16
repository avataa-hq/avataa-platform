import {
  handleApiAction,
  parametersApi,
  useTranslate,
  MultipleParameterDeleteBody,
} from '6_shared';

export const useDeleteMultipleParameters = () => {
  const { useMultipleParameterDeleteMutation } = parametersApi;
  const translate = useTranslate();

  const [
    deleteParameters,
    { isLoading: isMultipleDeleteParamsLoading, isSuccess: isMultipleDeleteParamsSuccess },
  ] = useMultipleParameterDeleteMutation();

  const deleteMultipleParameters = async (
    body: MultipleParameterDeleteBody[],
    successMessageText?: string,
  ) => {
    await handleApiAction(
      () => deleteParameters(body).unwrap(),
      successMessageText ? translate('Parameter deleted successfully') : undefined,
    );
  };

  return {
    deleteMultipleParameters,
    isMultipleDeleteParamsLoading,
    isMultipleDeleteParamsSuccess,
  };
};
