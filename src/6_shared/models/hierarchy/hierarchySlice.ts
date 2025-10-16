import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InventoryObjectType } from '6_shared/api/inventory/types';
import { GlobalSearchResult, IFilterSetModel, IInventoryObjectModel } from '6_shared';
import { Hierarchy, HierarchyObject } from '6_shared/api/hierarchy/types';
import { filtredByCoord, hasLatLng } from './hierarchySliceHelpers';

type ISelectedItem = {
  object_id: number | null;
  additional_params?: string | number | null;
  parent_id?: string;
  latitude?: number;
  longitude?: number;
  child_count?: number;
  id?: string;
  key?: string;
  object_type_id?: number;
  hierarchy_id?: number | null;
  level?: number;
};

interface IHierarchy {
  activeHierarchy: Hierarchy | null;
  selectedHierarchyItem: null | HierarchyObject;
  selectedObjectTypeItem: null | InventoryObjectType;

  searchedObject: null | GlobalSearchResult;
  searchUsingHierarchy: null | string;
  parentId: number;
  selectedMO: null | IInventoryObjectModel;
  selectedChild: string;
  childItems: HierarchyObject[];
  parentItems: HierarchyObject[];

  childrenInItem: any[];
  coordinatesList: any[];
  rClickItem: ISelectedItem;

  selectedParentId: string;
  hierarchyFilter: IFilterSetModel | null;

  globalSearchValue: string;
  isImportDisabled: boolean;

  hierarchyTmoId: number | null;

  selectNestedTMO: boolean;
}

const rootHierarchy = [
  {
    id: 'root',
    key: 'Root',
    object_id: 0,
    object_type_id: 0,
    additional_params: '',
    hierarchy_id: 0,
    level: 0,
    parent_id: '',
    latitude: 0,
    longitude: 0,
    child_count: 0,
  },
];

const initialState: IHierarchy = {
  activeHierarchy: null,
  selectedHierarchyItem: null,
  selectedObjectTypeItem: null,

  searchedObject: null,
  searchUsingHierarchy: null,
  parentId: 0,
  selectedMO: null,
  selectedChild: '',
  childItems: [],
  parentItems: rootHierarchy,

  childrenInItem: [],
  coordinatesList: [],
  rClickItem: { object_id: null },
  selectedParentId: 'root',
  hierarchyFilter: null,
  hierarchyTmoId: null,

  globalSearchValue: '',
  isImportDisabled: false,
  selectNestedTMO: true,
};

const hierarchySlice = createSlice({
  name: 'hierarchy',
  initialState,
  reducers: {
    setActiveHierarchy(state, action: PayloadAction<Hierarchy | null>) {
      state.activeHierarchy = action.payload;
    },
    setSelectedIHierarchyItem(state, action) {
      state.selectedHierarchyItem = action.payload;
    },
    setSelectedObjectTypeItem(state, action) {
      state.selectedObjectTypeItem = action.payload;
    },
    setSearchedObject(state, action) {
      state.searchedObject = action.payload;
    },
    setSearchUsingHierarchy(state, action: PayloadAction<string | null>) {
      state.searchUsingHierarchy = action.payload;
    },
    setParentId(state, action) {
      state.parentId = action.payload;
    },
    setSelectedChild: (state, action) => {
      state.selectedChild = action.payload;
    },
    setChildItems: (state, action) => {
      state.childItems = action.payload;
    },
    setParentItems: (state, action) => {
      state.parentItems = initialState.parentItems.concat(action.payload);
    },
    setResetParentItems: (state) => {
      state.parentItems = initialState.parentItems;
    },
    setSelectedMO(state, action) {
      state.selectedMO = action.payload;
      if (
        state.selectedHierarchyItem &&
        Object.keys(state.selectedHierarchyItem).length &&
        hasLatLng(state.selectedHierarchyItem)
      ) {
        state.coordinatesList = [state.selectedHierarchyItem];
      }
    },
    setChildrenItem(state, action) {
      state.childrenInItem = action.payload;

      state.coordinatesList = filtredByCoord(state.childrenInItem);
    },
    setRClickItem(state, action) {
      state.rClickItem = action.payload;
    },
    setHierarchyFilter: (s, a: PayloadAction<IFilterSetModel | null>) => {
      s.hierarchyFilter = a.payload;
    },
    setSelectedParentId: (s, a: PayloadAction<string>) => {
      s.selectedParentId = a.payload;
    },
    setGlobalSearchValue: (state, action: PayloadAction<string>) => {
      state.globalSearchValue = action.payload;
    },
    setIsImportDisabled: (s, a: PayloadAction<boolean>) => {
      s.isImportDisabled = a.payload;
    },
    setHierarchyTmoId: (s, a: PayloadAction<number | null>) => {
      s.hierarchyTmoId = a.payload;
    },
    setSelectNestedTMO: (s, a: PayloadAction<boolean>) => {
      s.selectNestedTMO = a.payload;
    },
    restore: (s, a: PayloadAction<IHierarchy>) => a.payload,
  },
});

export const hierarchyActions = hierarchySlice.actions;
export const hierarchyReducer = hierarchySlice.reducer;
export const hierarchySliceName = hierarchySlice.name;
