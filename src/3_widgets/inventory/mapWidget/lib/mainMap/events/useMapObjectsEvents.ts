import { MutableRefObject } from 'react';
import { MarkerDragEvent } from 'react-map-gl';
import { GeoJSONPoint, IInventoryObjectModel } from '6_shared';
import {
  IMapBoxObjectCustomEvent,
  IMapboxObjectsEvents,
  ISelectedInventoryObject,
} from '6_shared/models/inventoryMapWidget/types';
import { Ruler } from '../Ruler';

interface IMapObjectsProps {
  rulerRef: MutableRefObject<Ruler | null>;
  getLineSelectedObject?: (clickedObject: ISelectedInventoryObject) => void;
  dataPoints?: GeoJSONPoint<IInventoryObjectModel>;
  newDataPoints?: GeoJSONPoint<IInventoryObjectModel>;
  setNewDataPoints?: (newDataPoints: GeoJSONPoint<IInventoryObjectModel>) => void;
  getObjectAndCoordinatesToUpdate?: (...args: any[]) => Promise<void>;
  getParentOrObject?: (object: IInventoryObjectModel) => Promise<IInventoryObjectModel | null>;
  isActiveRulerTool?: boolean;
}

export const useMapObjectsEvents = ({
  rulerRef,
  getLineSelectedObject,
  dataPoints,
  newDataPoints,
  setNewDataPoints,
  getObjectAndCoordinatesToUpdate,
  isActiveRulerTool,
  getParentOrObject,
}: IMapObjectsProps): IMapboxObjectsEvents => {
  const onObjectOnMapClick = (
    event?: IMapBoxObjectCustomEvent,
    clickedObject?: ISelectedInventoryObject,
  ) => {
    if (rulerRef.current && event && isActiveRulerTool) rulerRef.current.onRulerClick(event);
    if (clickedObject && getLineSelectedObject) getLineSelectedObject(clickedObject);
  };
  const onObjectOnMapContextMenu = () => {};
  const onObjectOnMapDblClick = () => {};
  const onObjectOnMapDragStart = () => {};
  const onObjectOnMapDrag = () => {};
  const onObjectOnMapDragEnd = async (e: MarkerDragEvent, id: number) => {
    const { lngLat } = e;
    const currentObject = dataPoints?.features.find((dp) => dp.properties.id === id);
    if (currentObject && currentObject.properties) {
      if (newDataPoints) {
        const newPointsFeatureData: GeoJSONPoint<IInventoryObjectModel>['features'] =
          newDataPoints.features.map((dp) => {
            if (dp.properties.id !== id) return dp;
            return {
              ...dp,
              geometry: { type: 'Point', coordinates: [lngLat.lng, lngLat.lat] },
            };
          });
        const newPointsData: GeoJSONPoint<IInventoryObjectModel> = {
          ...newDataPoints,
          features: newPointsFeatureData,
        };
        setNewDataPoints?.(newPointsData);
      }

      const neededObject = await getParentOrObject?.(
        currentObject.properties as IInventoryObjectModel,
      );

      if (neededObject) {
        getObjectAndCoordinatesToUpdate?.({
          newCoordinates: lngLat,
          object: neededObject,
        });
      }
    }
  };

  const mapObjectsEvents = {
    onObjectOnMapClick,
    onObjectOnMapContextMenu,
    onObjectOnMapDblClick,
    onObjectOnMapDragStart,
    onObjectOnMapDrag,
    onObjectOnMapDragEnd,
  };

  return mapObjectsEvents;
};
