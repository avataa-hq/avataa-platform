import {
  handleApiAction,
  IUpdateObjectTemplateBody,
  objectTemplatesApi,
  useTranslate,
} from '6_shared';

export const useUpdateTemplate = () => {
  const translate = useTranslate();

  const { useUpdateTemplateMutation } = objectTemplatesApi;

  const [updateTemplate] = useUpdateTemplateMutation();

  const updateTemplateFn = async (body: IUpdateObjectTemplateBody) => {
    const res = await handleApiAction(
      () => updateTemplate(body).unwrap(),
      translate('Template updated successfully'),
    );
    return res;
  };

  return { updateTemplateFn };
};
