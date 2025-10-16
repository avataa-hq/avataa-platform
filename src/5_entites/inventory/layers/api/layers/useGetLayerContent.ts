import { layersMsApi } from '6_shared';

interface IProps {
  layerId?: number;
  skip?: boolean;
}

export const useGetLayerContent = ({ layerId, skip }: IProps) => {
  const { useGetLayerContentQuery, useLazyGetLayerContentQuery } = layersMsApi.layers;

  const { data: layerContentData, isFetching: isLayerContentFetching } = useGetLayerContentQuery(
    { layer_id: layerId || 0 },
    { skip: skip || !layerId },
  );

  const [getLayerContent] = useLazyGetLayerContentQuery();

  return { layerContentData, isLayerContentFetching, getLayerContent };
};
