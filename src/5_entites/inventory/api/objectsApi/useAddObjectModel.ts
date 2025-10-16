import { handleApiAction, objectsApi, useTranslate } from '6_shared';

export const useAddObjectModel = () => {
  const translate = useTranslate();

  const [addObjectModel] = objectsApi.useAddObjectModelMutation();

  const addObjectModelFn = async (body: FormData) => {
    await handleApiAction(
      () => addObjectModel(body).unwrap(),
      translate('Object model added successfully'),
    );
  };
  return { addObjectModelFn };
};
