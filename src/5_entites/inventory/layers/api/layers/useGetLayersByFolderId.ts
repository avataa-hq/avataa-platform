import { layersMsApi } from '6_shared';

interface IProps {
  folder_id?: number;
}

export const useGetLayersByFolderId = ({ folder_id }: IProps) => {
  const { useGetLayersByFolderIdQuery } = layersMsApi.layers;

  const { data: layersByFolderIdData, isFetching: isLayersByFolderIdFetching } =
    useGetLayersByFolderIdQuery({ folder_id });

  return { layersByFolderIdData, isLayersByFolderIdFetching };
};
