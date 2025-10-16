import { handleApiAction, inventoryDocumentsApi, UpdateFileBody, useTranslate } from '6_shared';

export const useUpdateDocument = () => {
  const translate = useTranslate();
  const [updateDocument, { isLoading: isUpdateDocumentLoading, isError: isUpdateDocumentError }] =
    inventoryDocumentsApi.useUpdateFileMutation();

  const updateDocumentFn = async (body: UpdateFileBody) => {
    await handleApiAction(
      () => updateDocument(body).unwrap(),
      translate('File updated successfully'),
    );
  };

  return { updateDocumentFn, isUpdateDocumentLoading, isUpdateDocumentError };
};
