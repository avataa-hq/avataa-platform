import { IPostFileBody, handleApiAction, inventoryDocumentsApi, useTranslate } from '6_shared';

export const useAddNewDocumentToObject = () => {
  const translate = useTranslate();
  const [postNewDocumentFn, { isError, isLoading }] =
    inventoryDocumentsApi.usePostDocumentFileMutation();

  const postNewDocument = async (body: IPostFileBody) => {
    await handleApiAction(
      () => postNewDocumentFn(body).unwrap(),
      translate('File added successfully'),
    );
  };

  return { postNewDocument, isError, isLoading };
};
