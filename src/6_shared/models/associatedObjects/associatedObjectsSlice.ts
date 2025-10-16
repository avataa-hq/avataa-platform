import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GridPaginationModel, GridRowSelectionModel } from '@mui/x-data-grid-premium';
import {
  CompositePaginationItem,
  CompositeColumnsVisibilityItem,
  CompositeFiltersItem,
  CompositeSortingItem,
  CompositeColumnDimensionsItem,
  CompositeColumnsOrderItem,
  CompositePinnedColumnsItem,
  DEFAULT_PAGINATION_MODEL,
} from '6_shared';
import {
  AssociatedObjectsType,
  ComposedSelectedTmoPayload,
  IAssociatedObjectsState,
  NavigationData,
} from './types';

const initialState: IAssociatedObjectsState = {
  associatedObjectType: null,
  skipFetching: false,
  currentMoId: null,
  isOpenAssociatedTableModal: false,
  objectDataToRequest: [],
  selectedObjectRequestData: null,
  detailedView: {
    selectedTmo: null,
    composedSelectedTmo: null,
    tprmNameWhenOpen: null,
    searchValue: {},
    pagination: {},
    filters: {},
    sorting: {},
    visibleColumns: {},
    isObjectsActive: true,
    rightClickedRowId: null,
    selectedRows: [],
    isCheckboxSelection: false,
    columnDimensions: {},
    customColumnsOrder: {},
    pinnedColumns: {},
  },
  objectHistory: [],
  commonView: {
    pagination: DEFAULT_PAGINATION_MODEL,
  },
};

const getCorrectObjectRequestData = (
  currentData: NavigationData[],
  newData: NavigationData[] | NavigationData,
) => {
  let correctObjects: NavigationData[] = [];
  let correctSelectedItem: NavigationData | null = null;

  if (Array.isArray(newData)) {
    correctSelectedItem = newData[newData.length - 1];
    correctObjects = newData.map((item, idx) => {
      const correctItem = { ...item, active: false, order: idx };
      if (correctItem.id === newData[newData.length - 1].id) {
        return { ...correctItem, active: true };
      }
      return correctItem;
    });
  } else {
    correctObjects = [newData];
    correctSelectedItem = newData;
  }

  return { correctObjects, correctSelectedItem: correctSelectedItem as NavigationData | null };
};

const associatedObjectsSlice = createSlice({
  name: 'associatedObjectsComponent',
  initialState,
  reducers: {
    setDetailedViewFilters: (state, action: PayloadAction<CompositeFiltersItem>) => {
      state.detailedView.filters[action.payload.tmoId] = action.payload.selectedFilter;
    },
    setSelectedTmo: (state, action: PayloadAction<number | null>) => {
      state.detailedView.selectedTmo = action.payload;
    },

    setComposedSelectedTmo: (state, action: PayloadAction<ComposedSelectedTmoPayload | null>) => {
      if (action.payload) {
        const { tmoId, tprmName } = action.payload;
        const composedName = `${tmoId}@${tprmName ?? ''}`;
        state.detailedView.composedSelectedTmo = composedName;
      } else {
        state.detailedView.composedSelectedTmo = null;
      }
    },
    setTprmNameWhenOpen: (state, action: PayloadAction<string | null>) => {
      state.detailedView.tprmNameWhenOpen = action.payload;
    },
    setDetailedViewSearchValue: (
      state,
      action: PayloadAction<{ tmoId: number; searchValue: string }>,
    ) => {
      state.detailedView.searchValue[action.payload.tmoId] = action.payload.searchValue;
    },
    setIsDetailedViewObjectActive: (state, action: PayloadAction<boolean>) => {
      state.detailedView.isObjectsActive = action.payload;
    },
    setCommonViewPagination: (state, action: PayloadAction<GridPaginationModel>) => {
      state.commonView.pagination = action.payload;
    },
    setDetailedViewPagination: (state, action: PayloadAction<CompositePaginationItem>) => {
      state.detailedView.pagination[action.payload.tmoId] = action.payload.pagination;
    },
    setDetailedViewSorting: (state, action: PayloadAction<CompositeSortingItem>) => {
      state.detailedView.sorting[action.payload.tmoId] = action.payload.sorting;
    },
    setDetailedViewColumns: (state, action: PayloadAction<CompositeColumnsVisibilityItem>) => {
      state.detailedView.visibleColumns[action.payload.tmoId] = action.payload.visibleColumns;
    },
    setDetailedViewRightClickedRowId: (state, action: PayloadAction<number | null>) => {
      state.detailedView.rightClickedRowId = action.payload;
    },
    setExportDataDelimiter: (state, action: PayloadAction<string>) => {
      state.detailedView.exportDataDelimiter = action.payload;
    },
    setAssociatedObjectType: (state, action: PayloadAction<AssociatedObjectsType>) => {
      state.associatedObjectType = action.payload;
    },
    pushToObjectHistory: (
      state,
      action: PayloadAction<{ id: number; popupType: AssociatedObjectsType }>,
    ) => {
      state.objectHistory.push(action.payload);
    },
    popFromObjectHistory: (state) => {
      if (state.objectHistory.length > 1) state.objectHistory.pop();
      if (state.objectHistory.length === 1) state.objectHistory = [];
    },
    setSkipFetching: (state, action: PayloadAction<boolean>) => {
      state.skipFetching = action.payload;
    },
    setCurrentMoId: (state, action: PayloadAction<number | null>) => {
      state.currentMoId = action.payload;
    },
    setIsOpenAssociatedTableModal: (
      state,
      action: PayloadAction<
        boolean | { isOpen: boolean; type: AssociatedObjectsType; initialId?: number | null }
      >,
    ) => {
      if (typeof action.payload === 'boolean') {
        state.isOpenAssociatedTableModal = action.payload;
      } else {
        const { type, isOpen, initialId } = action.payload;
        state.isOpenAssociatedTableModal = isOpen;
        state.associatedObjectType = type;
        if (initialId) {
          const navItem = { id: initialId, associatedType: type, active: true, order: 0 };
          const { correctObjects, correctSelectedItem } = getCorrectObjectRequestData(
            state.objectDataToRequest,
            navItem,
          );
          state.objectDataToRequest = correctObjects;
          state.selectedObjectRequestData = correctSelectedItem;
        }
      }
    },
    setObjectDataToRequest: (
      state,
      { payload }: PayloadAction<NavigationData | NavigationData[]>,
    ) => {
      const { correctObjects, correctSelectedItem } = getCorrectObjectRequestData(
        state.objectDataToRequest,
        payload,
      );

      state.objectDataToRequest = correctObjects;
      state.selectedObjectRequestData = correctSelectedItem;
      state.associatedObjectType = correctSelectedItem ? correctSelectedItem.associatedType : null;
    },
    setSelectedObjectRequestData: (state, action: PayloadAction<NavigationData | null>) => {
      state.selectedObjectRequestData = action.payload;
      state.associatedObjectType = action.payload ? action.payload.associatedType : null;
      state.objectDataToRequest = state.objectDataToRequest.map((i) => {
        if (i.id === action.payload?.id) return { ...i, active: true };
        return { ...i, active: false };
      });
    },
    setSelectedRows: (state, action: PayloadAction<GridRowSelectionModel>) => {
      state.detailedView.selectedRows = action.payload;
    },
    setIsCheckboxSelection: (state, action: PayloadAction<boolean>) => {
      state.detailedView.isCheckboxSelection = action.payload;
    },
    setColumnDimensions: (state, action: PayloadAction<CompositeColumnDimensionsItem>) => {
      state.detailedView.columnDimensions[action.payload.tmoId] = action.payload.columnDimensions;
    },
    setColumnsOrder: (state, action: PayloadAction<CompositeColumnsOrderItem>) => {
      state.detailedView.customColumnsOrder[action.payload.tmoId] = action.payload.columnsOrder;
    },
    setPinnedColumns: (state, action: PayloadAction<CompositePinnedColumnsItem>) => {
      state.detailedView.pinnedColumns[action.payload.tmoId] = action.payload.pinnedColumns;
    },
    restore: (_, action: PayloadAction<IAssociatedObjectsState>) => action.payload,
  },
});

export const associatedObjectsActions = associatedObjectsSlice.actions;
export const associatedObjectsReducer = associatedObjectsSlice.reducer;
export const associatedObjectsSliceName = associatedObjectsSlice.name;
