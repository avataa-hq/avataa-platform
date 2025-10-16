import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { Control, IControl } from 'mapbox-gl';
import { GeoJSONPoint, IInventoryBoundsModel, IInventoryObjectModel } from '6_shared';
import { BBox } from 'geojson';
import {
  IMapboxEvents,
  IMapViewState,
  ISelectedInventoryObject,
  MapInstanceType,
} from '6_shared/models/inventoryMapWidget/types';
import { useMapEvents } from './useMapEvents';
import { useMapObjectsEvents } from './useMapObjectsEvents';
import { Point, Ruler } from '../Ruler';

interface IProps {
  mapInstance?: MutableRefObject<MapInstanceType | null>;
  mapViewState?: IMapViewState;
  rulerRef: MutableRefObject<Ruler | null>;
  // drawPolygonInstance: MapboxDraw | null;
  drawPolygonInstance: Control | IControl | null;
  isActiveRulerTool?: boolean;
  setLinePoints?: Dispatch<SetStateAction<Point[]>>;
  editMode?: boolean;
  setUpdatekey?: Dispatch<SetStateAction<number>>;
  setBounds?: (...args: any[]) => void;
  setMapBounds?: Dispatch<SetStateAction<BBox | undefined>>;
  outerMapBounds?: IInventoryBoundsModel | null;
  paddingMapBounds?: IInventoryBoundsModel | null;
  getLineSelectedObject?: (clickedObject: ISelectedInventoryObject) => void;
  dataPoints?: GeoJSONPoint<IInventoryObjectModel>;
  newDataPoints?: GeoJSONPoint<IInventoryObjectModel>;
  setNewDataPoints?: (newDataPoints: GeoJSONPoint<IInventoryObjectModel>) => void;
  getObjectAndCoordinatesToUpdate?: (...args: any[]) => Promise<void>;
  getParentOrObject?: (object: IInventoryObjectModel) => Promise<IInventoryObjectModel | null>;
}

export const useEvents = ({
  mapInstance,
  mapViewState,
  drawPolygonInstance,
  rulerRef,
  setLinePoints,
  editMode,
  isActiveRulerTool,
  setUpdatekey,
  setBounds,
  setMapBounds,
  paddingMapBounds,
  outerMapBounds,
  getLineSelectedObject,
  newDataPoints,
  setNewDataPoints,
  dataPoints,
  getObjectAndCoordinatesToUpdate,
  getParentOrObject,
}: IProps): IMapboxEvents & IMapboxEvents => {
  const mapEvents = useMapEvents({
    mapViewState,
    setLinePoints,
    drawPolygonInstance,
    rulerRef,
    editMode,
    isActiveRulerTool,
    setUpdatekey,
    setBounds,
    setMapBounds,
    paddingMapBounds,
    outerMapBounds,
    mapInstance,
  });
  const mapObjectsEvents = useMapObjectsEvents({
    rulerRef,
    getLineSelectedObject,
    newDataPoints,
    dataPoints,
    setNewDataPoints,
    getObjectAndCoordinatesToUpdate,
    isActiveRulerTool,
    getParentOrObject,
  });

  return { ...mapEvents, ...mapObjectsEvents };
};
