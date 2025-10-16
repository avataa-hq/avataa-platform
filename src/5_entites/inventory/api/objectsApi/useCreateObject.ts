import {
  type CreateObjectBody,
  type IInventoryObjectModel,
  handleApiAction,
  objectsApi,
  useTranslate,
} from '6_shared';

export const useCreateObject = () => {
  const translate = useTranslate();

  const [createObject, { isLoading: isLoadingCreateObject, isSuccess: isSuccessCreateObject }] =
    objectsApi.useCreateObjectMutation();

  const createObjectFn = async (body: CreateObjectBody) => {
    const res = await handleApiAction(
      () => createObject(body).unwrap(),
      translate('Object created successfully'),
    );
    return res as IInventoryObjectModel;
  };

  return { createObjectFn, isLoadingCreateObject, isSuccessCreateObject };
};
