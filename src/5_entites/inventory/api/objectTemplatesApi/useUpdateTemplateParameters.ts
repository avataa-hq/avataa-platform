import {
  handleApiAction,
  IUpdateObjectTemplateParametersBody,
  objectTemplatesApi,
  useTranslate,
} from '6_shared';

export const useUpdateTemplateParameters = () => {
  const translate = useTranslate();

  const { useUpdateTemplateObjectParametersMutation } = objectTemplatesApi;

  const [updateTemplateObjectParameters] = useUpdateTemplateObjectParametersMutation();

  const updateTemplateObjectParametersFn = async (body: IUpdateObjectTemplateParametersBody) => {
    const res = await handleApiAction(
      () => updateTemplateObjectParameters(body).unwrap(),
      translate('Template parameters updated successfully'),
    );
    return res;
  };

  return { updateTemplateObjectParametersFn };
};
