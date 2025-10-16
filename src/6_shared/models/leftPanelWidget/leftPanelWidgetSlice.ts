import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFilterSetModel } from '6_shared';
import { IFilterSetModelItem } from './types';
import { IObjectTypeCustomizationParams } from '../inventoryMapWidget/types';

export type ILeftPanelSelectedTab =
  | 'filters'
  | 'topology'
  | 'objectTypes'
  | 'favorites'
  | 'layers'
  | 'templates';

export type ILeftPanelSelectedTabs = {
  [key: string]: 'filters' | 'topology' | 'objectTypes' | 'favorites' | 'layers' | 'templates';
};
interface IInitialState {
  selectedTabs: ILeftPanelSelectedTabs;
  searchValues: {
    [key: string]: string;
  };
  showPrivateOnly: boolean;
  selectedMultiFilter: IFilterSetModel | null;
  multiFilterSetList: IFilterSetModelItem[];
  multiFilterTmoIds: string[];
  multiFilterSeverityIds: string[];

  selectedObjectTypesIds: number[];
  objectTypeCustomizationParams: Record<number, IObjectTypeCustomizationParams>;
  legendCustomizationParams: Record<number, IObjectTypeCustomizationParams>;
}

const initialState: IInitialState = {
  selectedTabs: {
    inventory: 'objectTypes',
    map: 'objectTypes',
    processManager: 'filters',
    objects: 'objectTypes',
    templates: 'templates',
  },
  searchValues: {
    inventory: '',
    map: '',
    processManager: '',
    objects: '',
    layers: '',
  },
  showPrivateOnly: false,

  selectedMultiFilter: null,
  multiFilterSetList: [],
  multiFilterTmoIds: [],
  multiFilterSeverityIds: [],

  selectedObjectTypesIds: [],
  objectTypeCustomizationParams: {},
  legendCustomizationParams: {},
};

const leftPanelWidgetSlice = createSlice({
  name: 'leftPanelWidget',
  initialState,
  reducers: {
    setSelectedTab: (s, a: PayloadAction<{ module: string; value: ILeftPanelSelectedTab }>) => {
      if (s.selectedTabs.hasOwnProperty(a.payload.module)) {
        s.selectedTabs[a.payload.module] = a.payload.value;
      } else {
        console.error(`Module '${a.payload.module}' does not exist in selectedTabs state`);
      }
    },
    setSearchValue: (s, a: PayloadAction<{ module: string; value: string }>) => {
      if (s.searchValues.hasOwnProperty(a.payload.module)) {
        s.searchValues[a.payload.module] = a.payload.value;
      } else {
        console.error(`Module '${a.payload.module}' does not exist in searchValues state`);
      }
    },
    setSelectedMultiFilter: (s, a: PayloadAction<IFilterSetModel | null>) => {
      s.selectedMultiFilter = a.payload;
    },
    setMultiFilterSetList: (s, a: PayloadAction<IFilterSetModelItem[]>) => {
      s.multiFilterSetList = a.payload;
    },
    setMultiFilterTmoIds: (s, a: PayloadAction<string[]>) => {
      s.multiFilterTmoIds = a.payload;
    },
    setMultiFilterSeverityIds: (s, a: PayloadAction<string[]>) => {
      s.multiFilterSeverityIds = a.payload;
    },
    setSelectedObjectTypesIds: (s, a: PayloadAction<number[]>) => {
      s.selectedObjectTypesIds = a.payload;
    },
    setObjectTypeCustomizationParams: (
      s,
      a: PayloadAction<Record<number, IObjectTypeCustomizationParams>>,
    ) => {
      s.objectTypeCustomizationParams = a.payload;
    },
    setLegendCustomizationParams: (
      s,
      a: PayloadAction<Record<number, IObjectTypeCustomizationParams>>,
    ) => {
      s.legendCustomizationParams = a.payload;
    },
    setShowPrivateOnly: (s, a: PayloadAction<boolean>) => {
      s.showPrivateOnly = a.payload;
    },
    restore: (_, action: PayloadAction<IInitialState>) => action.payload,
  },
});

export const leftPanelWidgetActions = leftPanelWidgetSlice.actions;
export const leftPanelWidgetReduser = leftPanelWidgetSlice.reducer;
export const leftPanelWidgetSliceName = leftPanelWidgetSlice.name;
