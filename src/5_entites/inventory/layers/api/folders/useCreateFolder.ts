import { handleApiAction, ICreateFolderBody, layersMsApi, useTranslate } from '6_shared';

export const useCreateFolder = () => {
  const translate = useTranslate();

  const { useCreateFolderMutation } = layersMsApi.folders;

  const [createFolderFn] = useCreateFolderMutation();

  const createFolder = async (body: ICreateFolderBody) => {
    const res = await handleApiAction(
      () => createFolderFn(body).unwrap(),
      translate('Folder created successfully'),
    );
    return res;
  };

  return { createFolder };
};
