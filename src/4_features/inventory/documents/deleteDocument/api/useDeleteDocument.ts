import { handleApiAction, inventoryDocumentsApi, useTranslate } from '6_shared';

export const useDeleteDocument = () => {
  const translate = useTranslate();

  const [deleteDocumentFn, { isLoading: isDeleteDocumentLoading, isError: isDeleteDocumentError }] =
    inventoryDocumentsApi.useDeleteFileMutation();

  const deleteDocument = async (id: string, externalSkip?: boolean) => {
    await handleApiAction(
      () => deleteDocumentFn({ id, externalSkip }).unwrap(),
      translate('File deleted successfully'),
    );
  };

  return { deleteDocument, isDeleteDocumentLoading, isDeleteDocumentError };
};
