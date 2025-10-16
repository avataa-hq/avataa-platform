import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GridRowSelectionModel } from '@mui/x-data-grid-premium';
import {
  CompositeColumnDimensionsItem,
  CompositeColumnsOrderItem,
  CompositeColumnsVisibilityItem,
  CompositeFiltersItem,
  CompositeIsCustomColumnsSetActiveItem,
  CompositeIsCustomFilters,
  CompositeIsDefaultSettingsBlockedItem,
  CompositePaginationItem,
  CompositePinnedColumnsItem,
  CompositeRowGroupingModel,
  CompositeSortingItem,
  INestedMultiFilterForm,
} from '6_shared';
import { IInventoryTableData } from './types';

const initialState: IInventoryTableData = {
  filters: {},
  visibleColumns: {},
  pagination: {},
  sorting: {},
  selectedRows: [],
  rightClickedRowId: null,
  searchValue: {},
  isCustomFiltersSetActive: {},
  isCustomColumnsSetActive: {},
  customColumnsOrder: {},
  isParentsData: false,
  selectedFilter: {},
  pinnedColumns: {},
  isDefaultSettingsBlocked: {},
  columnDimensions: {},
  isCheckboxSelection: false,
  rowGroupingModel: {},
};

const invTableSlice = createSlice({
  name: 'inventoryTable',
  initialState,
  reducers: {
    setFilters: (
      state,
      action: PayloadAction<{ tmoId: number; filters: INestedMultiFilterForm }>,
    ) => {
      state.filters[action.payload.tmoId] = action.payload.filters;
    },
    setVisibleColumns: (state, action: PayloadAction<CompositeColumnsVisibilityItem>) => {
      state.visibleColumns[action.payload.tmoId] = action.payload.visibleColumns;
    },
    setPagination: (state, action: PayloadAction<CompositePaginationItem>) => {
      state.pagination[action.payload.tmoId] = action.payload.pagination;
    },
    setSorting: (state, action: PayloadAction<CompositeSortingItem>) => {
      state.sorting[action.payload.tmoId] = action.payload.sorting;
    },
    setSelectedRows: (state, action: PayloadAction<GridRowSelectionModel>) => {
      state.selectedRows = action.payload;
    },
    setRightClickedRowId: (state, action: PayloadAction<number>) => {
      state.rightClickedRowId = action.payload;
    },
    setSearchValue: (state, action: PayloadAction<{ tmoId: number; searchValue: string }>) => {
      state.searchValue[action.payload.tmoId] = action.payload.searchValue;
    },
    setIsCustomFiltersSetActive: (state, action: PayloadAction<CompositeIsCustomFilters>) => {
      state.isCustomFiltersSetActive[action.payload.tmoId] =
        action.payload.isCustomFiltersSetActive;
    },
    setIsCustomColumnsSetActive: (
      state,
      action: PayloadAction<CompositeIsCustomColumnsSetActiveItem>,
    ) => {
      state.isCustomColumnsSetActive[action.payload.tmoId] =
        action.payload.isCustomColumnsSetActive;
    },
    setColumnsOrder: (state, action: PayloadAction<CompositeColumnsOrderItem>) => {
      state.customColumnsOrder[action.payload.tmoId] = action.payload.columnsOrder;
    },
    setExportDataDelimiter: (state, action: PayloadAction<string>) => {
      state.exportDataDelimiter = action.payload;
    },
    setIsParentsData: (state, action: PayloadAction<boolean>) => {
      state.isParentsData = action.payload;
    },
    setSelectedFilter: (state, action: PayloadAction<CompositeFiltersItem>) => {
      state.selectedFilter[action.payload.tmoId] = action.payload.selectedFilter;
    },
    setColumnDimensions: (state, action: PayloadAction<CompositeColumnDimensionsItem>) => {
      state.columnDimensions[action.payload.tmoId] = action.payload.columnDimensions;
    },
    setPinnedColumns: (state, action: PayloadAction<CompositePinnedColumnsItem>) => {
      state.pinnedColumns[action.payload.tmoId] = action.payload.pinnedColumns;
    },
    setIsDefaultSettingsBlocked: (
      state,
      action: PayloadAction<CompositeIsDefaultSettingsBlockedItem>,
    ) => {
      state.isDefaultSettingsBlocked[action.payload.tmoId] =
        action.payload.isDefaultSettingsBlocked;
    },
    setRowGroupingModel: (state, action: PayloadAction<CompositeRowGroupingModel>) => {
      state.rowGroupingModel[action.payload.tmoId] = action.payload.rowGroupingModel;
    },
    setIsCheckboxSelection: (state, action: PayloadAction<boolean>) => {
      state.isCheckboxSelection = action.payload;
    },
    restore: (_, action: PayloadAction<IInventoryTableData>) => action.payload,
  },
});

export const invTableActions = invTableSlice.actions;
export const invTableReducer = invTableSlice.reducer;
export const invTableSliceName = invTableSlice.name;
