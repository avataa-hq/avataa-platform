import { layersMsApi } from '6_shared';

interface IProps {
  parent_folder_id?: number;
}

export const useGetFoldersByParentFolderId = ({ parent_folder_id }: IProps) => {
  const { useGetFoldersByParentFolderIdQuery } = layersMsApi.folders;

  const { data: foldersDataByParentFolderId, isFetching: isFoldersByParentFolderIdFetching } =
    useGetFoldersByParentFolderIdQuery({ parent_folder_id });

  return { foldersDataByParentFolderId, isFoldersByParentFolderIdFetching };
};
