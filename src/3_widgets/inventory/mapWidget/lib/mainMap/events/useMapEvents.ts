import { MapEvent, MapLayerMouseEvent } from 'react-map-gl';
import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { Control, IControl } from 'mapbox-gl';
import { BBox } from 'geojson';
import { IInventoryBoundsModel, useInventoryMapWidget, useObjectCRUD } from '6_shared';
import {
  IMapboxEvents,
  IMapViewState,
  MapInstanceType,
} from '6_shared/models/inventoryMapWidget/types';
import { Point, Ruler } from '../Ruler';

interface IMapEventsProps {
  mapInstance?: MutableRefObject<MapInstanceType | null>;
  mapViewState?: IMapViewState;
  rulerRef: MutableRefObject<Ruler | null>;
  drawPolygonInstance: Control | IControl | null;
  isActiveRulerTool?: boolean;
  setLinePoints?: Dispatch<SetStateAction<Point[]>>;
  editMode?: boolean;
  setUpdatekey?: Dispatch<SetStateAction<number>>;
  setBounds?: (...args: any[]) => void;
  setMapBounds?: Dispatch<SetStateAction<BBox | undefined>>;
  outerMapBounds?: IInventoryBoundsModel | null;
  paddingMapBounds?: IInventoryBoundsModel | null;
}

export const useMapEvents = ({
  mapInstance,
  mapViewState,
  isActiveRulerTool,
  rulerRef,
  drawPolygonInstance,
  setLinePoints,
  editMode,
  setUpdatekey,
  setBounds,
  setMapBounds,
  outerMapBounds,
  paddingMapBounds,
}: IMapEventsProps): IMapboxEvents => {
  const { setMapViewState } = useInventoryMapWidget();

  const { setIsObjectCRUDModalOpen } = useObjectCRUD();

  const onMapLoad = (event: MapEvent<any>) => {
    setTimeout(() => {
      setMapBounds?.(event.target?.getBounds().toArray().flat() as BBox);
    }, 400);
    if (mapViewState) {
      setBounds?.(mapViewState, outerMapBounds, paddingMapBounds);
    }

    if (!rulerRef.current) {
      rulerRef.current = new Ruler(event.target);
    }

    if (drawPolygonInstance) event.target.addControl(drawPolygonInstance);
  };
  const onMapClick = (event: MapLayerMouseEvent) => {
    if (isActiveRulerTool && rulerRef.current) {
      rulerRef.current.onRulerClick({
        detail: event.originalEvent.detail,
        position: {
          latitude: event.lngLat.lat,
          longitude: event.lngLat.lng,
        },
      });
    }
  };
  const onMapDblClick = (event: MapLayerMouseEvent) => {
    if (isActiveRulerTool && rulerRef.current) {
      rulerRef.current.onRulerDoubleClick();
      setLinePoints?.(rulerRef.current.points);
      if (rulerRef.current.points.length && editMode) {
        setIsObjectCRUDModalOpen(true);
      }
    }
  };
  const onMapViewStateChange = (viewState: IMapViewState) => {
    setBounds?.(viewState, outerMapBounds, paddingMapBounds);
    setMapBounds?.(mapInstance?.current?.getBounds().toArray().flat() as BBox);
    setMapViewState(viewState);
  };
  const onMapMouseMove = (event: MapLayerMouseEvent) => {
    if (isActiveRulerTool) {
      rulerRef.current?.onRuleMouseMove(event);
      setUpdatekey?.((k) => k + 1);
    }
  };

  const mapEvents = {
    onMapClick,
    onMapDblClick,
    onMapViewStateChange,
    onMapMouseMove,
    onMapLoad,
  };

  return mapEvents;
};
