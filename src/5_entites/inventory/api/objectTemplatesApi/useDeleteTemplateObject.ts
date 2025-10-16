import { handleApiAction, objectTemplatesApi, useTranslate } from '6_shared';

export const useDeleteTemplateObject = () => {
  const translate = useTranslate();

  const { useDeleteTemplateObjectMutation } = objectTemplatesApi;

  const [deleteTemplateObject] = useDeleteTemplateObjectMutation();

  const deleteTemplateObjectFn = async (templateObjectId: number) => {
    const res = await handleApiAction(
      () => deleteTemplateObject({ object_id: templateObjectId }).unwrap(),
      translate('Template object deleted successfully'),
    );
    return res;
  };

  return { deleteTemplateObjectFn };
};
