import {
  type DeleteParameterRequestParams,
  handleApiAction,
  parametersApi,
  useTranslate,
} from '6_shared';

export const useDeleteObjectParameter = () => {
  const translate = useTranslate();

  const [deleteObjectParameter] = parametersApi.useDeleteParameterMutation();

  const deleteObjectParameterFn = async (body: DeleteParameterRequestParams) => {
    await handleApiAction(
      () => deleteObjectParameter(body).unwrap(),
      translate('Parameter deleted successfully'),
    );
  };
  return { deleteObjectParameterFn };
};
