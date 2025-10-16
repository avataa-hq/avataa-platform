import {
  handleApiAction,
  ICreateObjectTemplateBody,
  objectTemplatesApi,
  useTranslate,
} from '6_shared';

export const useCreateTemplate = () => {
  const translate = useTranslate();

  const { useCreateTemplateMutation } = objectTemplatesApi;
  const [createTemplate] = useCreateTemplateMutation();

  const createTemplateFn = async (body: ICreateObjectTemplateBody) => {
    const res = await handleApiAction(
      () => createTemplate(body).unwrap(),
      translate('Template created successfully'),
    );
    return res;
  };

  return { createTemplateFn };
};
