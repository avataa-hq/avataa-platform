import useSupercluster from 'use-supercluster';
import { Options, AnyProps, PointFeature, ClusterProperties } from 'supercluster';
import type { BBox } from 'geojson';
import { useEffect, useState } from 'react';
import { GeoJSONPoint, IInventoryObjectModel } from '6_shared';
import { IMapViewState, SelectedMapType } from '6_shared/models/inventoryMapWidget/types';

const performance: Options<AnyProps, AnyProps> = {
  radius: 50,
  maxZoom: 16,
  extent: 50,
  nodeSize: 100,
};
const quality: Options<AnyProps, AnyProps> = {
  radius: 10,
  maxZoom: 14,
  extent: 150,
  nodeSize: 10,
};

const optimize: Options<AnyProps, AnyProps> = {
  radius: 20,
  maxZoom: 14,
  extent: 100,
  nodeSize: 50,
};

const threeD: Options<AnyProps, AnyProps> = {
  radius: 50,
  maxZoom: 18,
  extent: 50,
  nodeSize: 100,
};

export type SuperClusterChildren =
  | PointFeature<IInventoryObjectModel>
  | PointFeature<ClusterProperties & AnyProps>;

interface IProps {
  currentBounds?: BBox;
  dataPoints?: GeoJSONPoint<IInventoryObjectModel>;
  mapViewState?: IMapViewState;
  selectedMap: SelectedMapType;
}
export const useClusteredData = ({
  dataPoints,
  currentBounds,
  mapViewState,
  selectedMap,
}: IProps) => {
  const [clusterOptions, setClusterOptions] = useState<Options<AnyProps, AnyProps>>({
    radius: 80,
    maxZoom: 15,
    extent: 256,
    nodeSize: 133,
  });

  const [isOpenClusterOption, setIsOpenClusterOption] = useState(false);

  useEffect(() => {
    if (selectedMap === '3d') {
      setClusterOptions(threeD);
      return;
    }
    if (dataPoints) {
      if (dataPoints.features.length <= 500) {
        setClusterOptions(quality);
      } else if (dataPoints.features.length > 500 && dataPoints.features.length <= 5000) {
        setClusterOptions(optimize);
      } else if (dataPoints.features.length > 5000) {
        setClusterOptions(performance);
      }
    }
  }, [dataPoints, selectedMap]);

  useEffect(() => {
    const onClusterSettings = () => {
      setIsOpenClusterOption(true);
    };
    document.addEventListener('clustersetting', onClusterSettings);
    return () => {
      document.addEventListener('clustersetting', onClusterSettings);
    };
  }, []);

  const { clusters, supercluster } = useSupercluster({
    points: dataPoints?.features ?? [],
    zoom: mapViewState?.zoom || 18,
    bounds: currentBounds as BBox,
    options: clusterOptions,
  });

  return {
    clusters,
    supercluster,
    clusterOptions,
    setClusterOptions,
    isOpenClusterOption,
    setIsOpenClusterOption,
  };
};
