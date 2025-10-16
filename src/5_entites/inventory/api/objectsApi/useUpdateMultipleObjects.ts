import { handleApiAction, objectsApi, UpdateMultipleObjectsBody, useTranslate } from '6_shared';

export const useUpdateMultipleObjects = () => {
  const translate = useTranslate();
  const [updateMultipleObjects, { isLoading: isLoadingUpdateMultipleObjects }] =
    objectsApi.useUpdateMultipleObjectsMutation();

  const updateMultipleObjectFn = async (body: UpdateMultipleObjectsBody[]) => {
    const res = await handleApiAction(
      () => updateMultipleObjects(body).unwrap(),
      translate('Object updated successfully'),
    );

    return res;
  };

  return { updateMultipleObjectFn, isLoadingUpdateMultipleObjects };
};
