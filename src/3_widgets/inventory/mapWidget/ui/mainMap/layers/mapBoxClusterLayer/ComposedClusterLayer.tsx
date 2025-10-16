import { GeoJSONPoint, IInventoryObjectModel, NamedObjectPoint } from '6_shared';
import { Marker, MarkerDragEvent } from 'react-map-gl';
import { useEffect, useMemo, useState } from 'react';
import Supercluster, { AnyProps, ClusterProperties, PointFeature } from 'supercluster';
import { Typography, useTheme } from '@mui/material';
import {
  IMapBoxObjectCustomEvent,
  ISelectedInventoryObject,
} from '6_shared/models/inventoryMapWidget/types';
import { getIcon } from '3_widgets/inventory/mapWidget/lib/getIcon';
import { ClusterGroup } from './ClusterGroup';
import {
  MinimizeMarker,
  MinimizeMarkerIcon,
  MinimizeMarkerName,
} from './ComposedClusterLayer.styled';

const getMarkerSize = (zoom?: number) => {
  if (!zoom) return 250;
  let multiple = 10;
  if (zoom >= 18 && zoom <= 16) multiple = 25;
  if (zoom < 16 && zoom >= 14) multiple = 10;
  if (zoom < 14 && zoom >= 12) multiple = 8;
  if (zoom < 12 && zoom >= 8) multiple = 5;
  return multiple * zoom;
};
const getClickedObject = (object?: IInventoryObjectModel): ISelectedInventoryObject | undefined => {
  if (!object) return undefined;
  return {
    position: { latitude: object.latitude!, longitude: object.longitude! },
    object,
  };
};

interface IProps {
  selectedMarker?: ISelectedInventoryObject | null;
  // selectedMarkerList?: IMapDataPointModel[];
  selectedMarkerList?: Record<string, any>[];
  onClusterGroupClick?: (coordinates?: [number, number], newZoom?: number) => void;
  onClusterGroupContextmenu?: (
    clusterId: number,
    pointCount: number,
    coordinates?: [number, number],
  ) => void;

  onMarkerClick?: (
    event: IMapBoxObjectCustomEvent,
    clickedObject?: ISelectedInventoryObject,
  ) => void;
  onMarkerContextMenu?: (clickedObject?: ISelectedInventoryObject) => void;
  onMarkerDragEnd?: (e: MarkerDragEvent, id: number) => void;

  currentZoom?: number;
  loadingId?: number;

  clusters?: (PointFeature<IInventoryObjectModel> | PointFeature<ClusterProperties & AnyProps>)[];
  supercluster?: Supercluster<IInventoryObjectModel, AnyProps>;

  setPointsWithModel: (featuresWithModel: GeoJSONPoint<any>['features']) => void;
}

export const ComposedClusterLayer = ({
  selectedMarker,
  selectedMarkerList,
  onClusterGroupClick,
  onClusterGroupContextmenu,
  onMarkerContextMenu,
  onMarkerClick,
  currentZoom,
  loadingId,
  supercluster,
  onMarkerDragEnd,
  clusters,
  setPointsWithModel,
}: IProps) => {
  const [clustersList, setClustersList] = useState<
    (PointFeature<IInventoryObjectModel> | PointFeature<ClusterProperties & AnyProps>)[]
  >([]);
  const [markersList, setMarkersList] = useState<
    (PointFeature<IInventoryObjectModel> | PointFeature<ClusterProperties & AnyProps>)[]
  >([]);

  const { palette } = useTheme();

  const pointShadow = useMemo(() => {
    const maxZoom = (supercluster as unknown as any)?.options?.maxZoom;
    return !!currentZoom && currentZoom < maxZoom;
  }, [supercluster, currentZoom]);

  const showMinimizeName = useMemo(() => {
    const maxZoom = (supercluster as unknown as any)?.options?.maxZoom;
    return !!currentZoom && currentZoom - 1 < maxZoom;
  }, [supercluster, currentZoom]);

  const selectedIds = useMemo<number[]>(
    () => selectedMarkerList?.map((obj) => obj.id) || [],
    [selectedMarkerList],
  );

  const markerSize = useMemo(() => {
    return getMarkerSize(currentZoom);
  }, [currentZoom]);

  const isShowName = useMemo(() => {
    if (!currentZoom) return true;
    return currentZoom > 15;
  }, [currentZoom]);

  const onClickMarker = (
    e: React.MouseEvent,
    latitude: number,
    longitude: number,
    property: any,
  ) => {
    const clickedObject = getClickedObject(property as IInventoryObjectModel | undefined);
    const eventInfo: IMapBoxObjectCustomEvent = {
      detail: e.detail,
      position: { latitude, longitude },
    };
    onMarkerClick?.(eventInfo, clickedObject);
  };

  useEffect(() => {
    const clList: (
      | PointFeature<IInventoryObjectModel>
      | PointFeature<ClusterProperties & AnyProps>
    )[] = [];
    const mkList: (
      | PointFeature<IInventoryObjectModel>
      | PointFeature<ClusterProperties & AnyProps>
    )[] = [];
    const modelList: GeoJSONPoint<any>['features'] = [];

    if (clusters?.length === 0) {
      setClustersList([]);
      setMarkersList([]);
      setPointsWithModel([]);
    } else {
      clusters?.forEach((cl) => {
        const { properties } = cl;
        const { cluster: isCluster, model } = properties;
        if (isCluster) clList.push(cl);
        if (!isCluster && model) {
          modelList.push(cl as GeoJSONPoint<any>['features'][number]);
        }
        if (!isCluster && !model) mkList.push(cl);

        setClustersList(clList);
        setMarkersList(mkList);
        setPointsWithModel(modelList);
      });
    }
  }, [clusters, setPointsWithModel]);

  const pointsCluster = useMemo(() => {
    return clustersList.map((cl) => {
      const { geometry, properties } = cl;
      const [longitude, latitude] = geometry.coordinates;
      const { point_count: pointCount, dataLength } = properties;
      return (
        <Marker style={{ zIndex: '9' }} key={cl.id} longitude={longitude} latitude={latitude}>
          <ClusterGroup
            width={10 + (pointCount / dataLength) * 50}
            height={10 + (pointCount / dataLength) * 50}
            zIndex="9"
            count={pointCount}
            onGroupClick={() => {
              const expansionZoom = supercluster?.getClusterExpansionZoom(+cl.id!);
              onClusterGroupClick?.([longitude, latitude], expansionZoom);
            }}
            onGroupContextmenu={() => {
              if (cl.id)
                onClusterGroupContextmenu?.(+cl.id, pointCount as number, [longitude, latitude]);
            }}
          />
        </Marker>
      );
    });
  }, [clustersList, onClusterGroupClick, onClusterGroupContextmenu, supercluster]);

  const pointMarkers = useMemo(() => {
    return markersList.map((cl) => {
      const { geometry, properties } = cl;
      const [longitude, latitude] = geometry.coordinates;
      const { id, color, name, icon, minimize, label, similarObjects } = properties;

      const objectName = label && label !== '' ? label : name;

      const similarIds: number[] = similarObjects?.map((o: any) => o.id) ?? [];

      const isSelectedMarker =
        selectedMarker?.object?.id === id ||
        selectedIds.includes(id) ||
        similarIds.includes(selectedMarker?.object.id ?? -1) ||
        selectedIds.some((selId) => similarIds.includes(selId));

      const size = minimize ? 35 : markerSize;
      const getColor = () => {
        if (isSelectedMarker) return palette.success.main;
        if (!isSelectedMarker && color) return color;
        return palette.primary.main;
      };

      return (
        <Marker
          draggable={!!onMarkerDragEnd}
          onDragEnd={(e) => {
            onMarkerDragEnd?.(e, id);
          }}
          offset={[0, 0]}
          key={`inventory-${id}`}
          longitude={longitude}
          latitude={latitude}
          onClick={(e) => {
            if (minimize) {
              e.originalEvent.stopPropagation();
              e.originalEvent.preventDefault();
              const clickedObject = getClickedObject(
                properties as IInventoryObjectModel | undefined,
              );
              const eventInfo: IMapBoxObjectCustomEvent = {
                detail: e.originalEvent.detail,
                position: { latitude, longitude },
              };
              onMarkerClick?.(eventInfo, clickedObject);
            }
          }}
          style={{
            width: `${size}px`,
            zIndex: isSelectedMarker ? 9 : 8,
          }}
        >
          <div
            role="button"
            tabIndex={0}
            onContextMenu={(e) => {
              e.stopPropagation();
              e.preventDefault();
              const clickedObject = getClickedObject(
                properties as IInventoryObjectModel | undefined,
              );
              onMarkerContextMenu?.(clickedObject);
            }}
          >
            {minimize && (
              <MinimizeMarker>
                <MinimizeMarkerIcon>{getIcon(icon ?? 'TripOrigin', getColor())}</MinimizeMarkerIcon>
                {(!showMinimizeName || isSelectedMarker) && (
                  <MinimizeMarkerName>
                    <Typography variant="subtitle2">
                      {objectName.length > 10 ? `${objectName.slice(0, 10)}...` : objectName}
                    </Typography>
                  </MinimizeMarkerName>
                )}
              </MinimizeMarker>
            )}
            {!minimize && (
              <NamedObjectPoint
                circleColor={getColor()}
                icon={getIcon(icon, 'white')}
                title={(isShowName || isSelectedMarker) && objectName}
                // description={name}
                selected={isSelectedMarker}
                loading={loadingId === id}
                shadowSize={markerSize / 12}
                rippleSize={markerSize / 1.5}
                onClick={(e) => onClickMarker(e, latitude, longitude, properties)}
                shadow={pointShadow}
              />
            )}
          </div>
        </Marker>
      );
    });
  }, [
    markersList,
    selectedMarker?.object?.id,
    selectedIds,
    markerSize,
    onMarkerDragEnd,
    isShowName,
    loadingId,
    palette.success.main,
    palette.primary.main,
    onMarkerContextMenu,
    onClickMarker,
  ]);

  return (
    <>
      {pointsCluster}
      {pointMarkers}
    </>
  );
};
