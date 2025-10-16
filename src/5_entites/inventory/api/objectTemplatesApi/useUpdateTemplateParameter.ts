import {
  handleApiAction,
  IUpdateObjectTemplateParameterBody,
  objectTemplatesApi,
  useTranslate,
} from '6_shared';

export const useUpdateTemplateParameter = () => {
  const translate = useTranslate();

  const { useUpdateTemplateObjectParameterMutation } = objectTemplatesApi;

  const [updateTemplateObjectParameter, { isLoading }] = useUpdateTemplateObjectParameterMutation();

  const updateTemplateObjectParameterFn = async (body: IUpdateObjectTemplateParameterBody) => {
    const res = await handleApiAction(
      () => updateTemplateObjectParameter(body).unwrap(),
      translate('Template parameters updated successfully'),
    );
    return res;
  };

  return { updateTemplateObjectParameterFn, isLoading };
};
