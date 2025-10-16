import { layersMsApi } from '6_shared';

export const useGetFolders = () => {
  const { useGetFoldersQuery } = layersMsApi.folders;

  const { data: foldersData, isFetching: isFoldersFetching } = useGetFoldersQuery({});

  return { foldersData, isFoldersFetching };
};
