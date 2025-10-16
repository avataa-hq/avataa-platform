import { handleApiAction, inventoryDocumentsApi } from '6_shared';

export const useAddDocumentToObjectById = () => {
  const { useAddDocumentToObjectByIdMutation } = inventoryDocumentsApi;
  const [addDocumentToObjectByIdFn, { isLoading: isLoadingAddDocumentToObjectById }] =
    useAddDocumentToObjectByIdMutation();

  const addDocumentToObjectById = async ({
    objectId,
    body,
  }: {
    objectId: number;
    body: FormData;
  }) => {
    const res = await handleApiAction(
      () => addDocumentToObjectByIdFn({ objectId, body }).unwrap(),
      'Document added successfully',
    );

    return res;
  };

  return { addDocumentToObjectById, isLoadingAddDocumentToObjectById };
};
