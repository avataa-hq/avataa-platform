import { handleApiAction, objectTemplatesApi, useTranslate } from '6_shared';

export const useDeleteTemplateObjectParameter = () => {
  const translate = useTranslate();

  const { useDeleteTemplateObjectParameterMutation } = objectTemplatesApi;

  const [deleteTemplateObjectParameter, { isLoading }] = useDeleteTemplateObjectParameterMutation();

  const deleteTemplateObjectParameterFn = async (parameterId: number) => {
    const res = await handleApiAction(
      () => deleteTemplateObjectParameter({ parameter_id: parameterId }).unwrap(),
      translate('Template parameter deleted successfully'),
    );
    return res;
  };

  return { deleteTemplateObjectParameterFn, isLoading };
};
