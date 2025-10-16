import { Layer } from '@deck.gl/core/typed';
import { MapEvent, MapLayerMouseEvent, MarkerDragEvent, ViewState } from 'react-map-gl';

import { IMuiIconsType } from 'components/MUIIconLibrary/MUIIconLibrary';
import {
  IColorRangeModel,
  ILatitudeLongitude,
  IInventoryObjectModel,
  InventoryObjectTypesParamTypes,
  LineType,
  IPointsEvenlyPointModel,
} from '6_shared';
import { MapboxLayer } from '@deck.gl/mapbox/typed';
import { Feature, FeatureCollection, Point } from 'geojson';
import mapboxgl from 'mapbox-gl';

export type SelectedMapType = 'main' | 'sw' | '3d';

export type MapInstanceType = mapboxgl.Map;

export interface IMapViewState extends ViewState {}

export interface IColors {
  coloredTMOId: string;
  booleanValue: boolean;
  hex: string;
  id: string;
  name: string;
  visible: boolean;
}

export interface IObjectTypeCustomizationParams {
  icon: IMuiIconsType | null;
  tmoName: string;
  color?: string | number[];
  tprms?: InventoryObjectTypesParamTypes[] | undefined;
  coloredTprms?: IColorRangeModel | undefined;
  visible?: boolean;
  geometry_type: string | null;
  tmoLat: number | null;
  tmoLng: number | null;
  minimize?: boolean;
  tmoInheritLocation?: boolean;
  line_type: LineType | null;
}

export interface ISelectedInventoryObject {
  position: {
    latitude?: number;
    longitude?: number;
    x?: number;
    y?: number;
  };
  object: IInventoryObjectModel & { similarObjects?: IInventoryObjectModel[] };
}

type IExportMapContextMenuType = 'toKml' | 'toTab' | 'toExcel' | 'toJpeg' | 'toPng';
type IExportPolygonContextMenuType = 'toKml' | 'toTab' | 'toExcel';

export interface IContextMenuData<T extends string> {
  id: string;
  value: T;
  label: string;
  disabled?: boolean;
  isLoading?: boolean;
  submenu?: IContextMenuData<IExportMapContextMenuType | IExportPolygonContextMenuType>[];
  rule?: string | string[];
}

export type MapBoxObjectContextMenuType =
  | 'details'
  | 'edit'
  | 'viewDiagram'
  | 'viewFiles'
  // | 'runReports'
  | 'viewTable'
  | 'findPath'
  | 'createChild'
  | 'delete';

export type MapBoxPolygonContextMenuType = 'viewDiagram' | 'exportData'; // | 'edit' | 'runReports'
export type MapBoxMapContextMenuType = 'newObject' | 'exportData';

export interface ILegendData {
  id: string;
  name: string;
  geometry_type: string | null;
  icon: IMuiIconsType | null | undefined;
  coloredTprms: IColorRangeModel | undefined;
  line_type: LineType | null;
  visible: boolean;
}

export type MapStyleType = 'Default' | 'Streets' | 'Satellite' | 'Hybrid' | 'Navigation';

export interface IMapStyleModel {
  '2d': IMapStyle[];
  '3d': IMapStyle[];
}

interface IMapStyle {
  label: MapStyleType;
  style: {
    dark?: string;
    light: string;
  };
}

export interface IRenderTree {
  id: string | number;
  name: string;
  children?: IRenderTree[];

  [key: string]: any;
}

export interface IMapBoxObjectCustomEvent {
  detail?: number;
  position: ILatitudeLongitude;
}

export interface IMapboxEvents {
  onMapClick?: (event: MapLayerMouseEvent) => void;
  onMapContextMenu?: (event: MapLayerMouseEvent) => void;
  onMapDblClick?: (event: MapLayerMouseEvent) => void;
  onMapViewStateChange?: (viewState: IMapViewState) => void;
  onMapMouseMove?: (event: MapLayerMouseEvent) => void;
  onMapMoveEnd?: (event: MapLayerMouseEvent) => void;
  onMapLoad?: (event: MapEvent<any>) => void;
}

export interface IMapboxObjectsEvents {
  onObjectOnMapClick?: (
    info?: IMapBoxObjectCustomEvent,
    clickedObject?: ISelectedInventoryObject,
  ) => void;
  onObjectOnMapContextMenu?: () => void;
  onObjectOnMapDblClick?: () => void;
  onObjectOnMapDragStart?: () => void;
  onObjectOnMapDrag?: () => void;
  onObjectOnMapDragEnd?: (e: MarkerDragEvent, id: number) => void;
}

export interface PointsBetweenLine {
  id: number | string;
  count: number;
  consistsObjects: IInventoryObjectModel[];
  position: ILatitudeLongitude;
  color?: string | null;
}

export interface IBuildingPathItem {
  points: IPointsEvenlyPointModel[];
  lines: FeatureCollection;
}

export interface ILoadingMarkerModel {
  position: ILatitudeLongitude;
  object: Record<string, any> & { id: number };
}
