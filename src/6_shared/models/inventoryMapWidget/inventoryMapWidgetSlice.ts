import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILatitudeLongitude } from '6_shared/types';
import { IMapViewState, ISelectedInventoryObject, SelectedMapType } from './types';
import { MAP_INITIAL_STATE } from './constants';
// import { MAP_INITIAL_STATE } from '../config';
// import { ILatitudeLongitude } from '../../../../6_shared';

const initialViewState: IMapViewState = {
  zoom: MAP_INITIAL_STATE.zoom,
  // longitude: 2.173404,
  longitude: MAP_INITIAL_STATE.longitude,
  // latitude: 41.385063,
  latitude: MAP_INITIAL_STATE.latitude,
  padding: { top: 0, left: 0, bottom: 0, right: 0 },
  pitch: 0,
  bearing: 0,
};

interface IInitialState {
  selectedMap: SelectedMapType;
  selectedObject: ISelectedInventoryObject | null;
  selectedObjectList: Record<string, any>[];

  mapViewState: IMapViewState;

  markerPosition: ILatitudeLongitude | null;

  mapData: Record<string, any>[];
  requestedObjectIds: number[];
  tempCoordinates: (ILatitudeLongitude & { zoom?: number; speed?: number }) | null;
  isMapLegendOpen: boolean;

  isDrawPolygon: boolean;
  isDrawRuler: boolean;
}

const initialState: IInitialState = {
  selectedMap: 'main',
  selectedObject: null,
  selectedObjectList: [],

  mapViewState: initialViewState,

  markerPosition: null,

  mapData: [],
  requestedObjectIds: [],
  tempCoordinates: null,
  isMapLegendOpen: false,

  isDrawPolygon: false,
  isDrawRuler: false,
};

//= ================ =//

const inventoryMapWidgetSlice = createSlice({
  name: 'inventoryMapWidget',
  initialState,
  reducers: {
    changeSelectedMap: (s, a: PayloadAction<SelectedMapType>) => {
      s.selectedMap = a.payload;
    },
    setSelectedObject: (s, a: PayloadAction<ISelectedInventoryObject | null>) => {
      s.selectedObject = a.payload;
    },
    setMapViewState: (s, a: PayloadAction<IMapViewState>) => {
      s.mapViewState = a.payload;
    },
    setMarkerPosition: (s, a: PayloadAction<ILatitudeLongitude | null>) => {
      s.markerPosition = a.payload;
    },
    setMapData: (state, action: PayloadAction<Record<string, any>[]>) => {
      state.mapData = action.payload;
    },
    setTempCoordinates: (
      state,
      action: PayloadAction<(ILatitudeLongitude & { zoom?: number; speed?: number }) | null>,
    ) => {
      state.tempCoordinates = action.payload;
    },
    setSelectedObjectList: (state, action: PayloadAction<Record<string, any>[]>) => {
      state.selectedObjectList = action.payload;
    },
    setRequestedObjectId: (s, a: PayloadAction<number[]>) => {
      s.requestedObjectIds = a.payload;
    },
    setIsMapLegendOpen: (s, a: PayloadAction<boolean>) => {
      s.isMapLegendOpen = a.payload;
    },
    setIsDraw: (s, p: PayloadAction<{ what: 'polygon' | 'ruler'; value: boolean }>) => {
      if (p.payload.what === 'polygon') {
        s.isDrawPolygon = p.payload.value;
      } else {
        s.isDrawRuler = p.payload.value;
      }
    },
    restore: (_, action: PayloadAction<IInitialState>) => action.payload,
  },
});

export const inventoryMapWidgetActions = inventoryMapWidgetSlice.actions;
export const inventoryMapWidgetReducer = inventoryMapWidgetSlice.reducer;
export const inventoryMapWidgetSliceName = inventoryMapWidgetSlice.name;
