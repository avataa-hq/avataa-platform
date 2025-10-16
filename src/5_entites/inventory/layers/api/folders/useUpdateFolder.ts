import { handleApiAction, IUpdateFolderBody, layersMsApi, useTranslate } from '6_shared';

export const useUpdateFolder = () => {
  const translate = useTranslate();

  const { useUpdateFolderMutation } = layersMsApi.folders;

  const [updateFolderFn] = useUpdateFolderMutation();

  const updateFolder = async (body: IUpdateFolderBody) => {
    const res = await handleApiAction(
      () => updateFolderFn(body).unwrap(),
      translate('Folder updated successfully'),
    );
    return res;
  };

  return { updateFolder };
};
