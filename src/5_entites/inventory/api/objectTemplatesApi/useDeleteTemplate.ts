import { handleApiAction, objectTemplatesApi, useTranslate } from '6_shared';

export const useDeleteTemplate = () => {
  const translate = useTranslate();

  const { useDeleteTemplateMutation } = objectTemplatesApi;

  const [deleteTemplate] = useDeleteTemplateMutation();

  const deleteTemplateFn = async (templateId: number) => {
    const res = await handleApiAction(
      () => deleteTemplate({ template_id: templateId }).unwrap(),
      translate('Template deleted successfully'),
    );
    return res;
  };

  return { deleteTemplateFn };
};
