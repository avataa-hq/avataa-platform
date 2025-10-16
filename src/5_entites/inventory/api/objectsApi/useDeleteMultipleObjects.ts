import { DeleteMultipleObjectsBody, handleApiAction, objectsApi, useTranslate } from '6_shared';

export const useDeleteMultipleObjects = () => {
  const translate = useTranslate();
  const [deleteMultipleObjects, { isLoading }] = objectsApi.useDeleteMultipleObjectsMutation();

  const deleteMultipleObjectsFn = async (
    body: DeleteMultipleObjectsBody,
    withoutSuccessMessage?: boolean,
  ) => {
    const res = await handleApiAction(
      () => deleteMultipleObjects(body).unwrap(),
      withoutSuccessMessage ? undefined : translate('Object deleted successfully'),
    );
    return res;
  };

  return { deleteMultipleObjectsFn, isLoading };
};
