import { handleApiAction, IGetTemplateObjectsBody, objectTemplatesApi } from '6_shared';

export const useLazyGetTemplateObjects = () => {
  const { useLazyGetTemplateObjectsQuery } = objectTemplatesApi;

  const [getTemplateObjects] = useLazyGetTemplateObjectsQuery();

  const getTemplateObjectsFn = async (body: IGetTemplateObjectsBody) => {
    const res = await handleApiAction(() => getTemplateObjects(body).unwrap());
    return res;
  };

  return { getTemplateObjectsFn };
};
