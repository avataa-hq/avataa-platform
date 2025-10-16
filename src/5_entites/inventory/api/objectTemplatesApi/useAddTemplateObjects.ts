import {
  handleApiAction,
  IAddTemplateObjectsBody,
  objectTemplatesApi,
  useTranslate,
} from '6_shared';

export const useAddTemplateObjects = () => {
  const translate = useTranslate();

  const { useAddTemplateObjectsMutation } = objectTemplatesApi;

  const [addTemplateObject] = useAddTemplateObjectsMutation();

  const addTemplateObjectFn = async (body: IAddTemplateObjectsBody) => {
    const res = await handleApiAction(
      () => addTemplateObject(body).unwrap(),
      translate('Template object added successfully'),
    );
    return res;
  };

  return { addTemplateObjectFn };
};
