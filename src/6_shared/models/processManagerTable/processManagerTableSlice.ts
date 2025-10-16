import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  GridColumnVisibilityModel,
  GridPaginationModel,
  GridPinnedColumnFields,
  GridRowGroupingModel,
  GridSortModel,
} from '@mui/x-data-grid-premium';
import {
  CompositeColumnDimensionsItem,
  CompositeColumnsVisibilityItem,
  CompositeFiltersItem,
  CompositeIsDefaultSettingsBlockedItem,
  CompositePaginationItem,
  CompositePinnedColumnsItem,
  CompositeRowGroupingModel,
  CompositeSortingItem,
  INestedMultiFilterForm,
  SeverityProcessModelData,
} from '6_shared';
import { GridColumnDimensions } from '@mui/x-data-grid/hooks/features/columns/gridColumnsInterfaces';
import { PmSelectedRow } from './types';

interface IInitialState {
  selectedRows: PmSelectedRow[];
  selectedRow: SeverityProcessModelData | null;

  exportDataDelimiter?: string;

  customColumnsModelIds: Record<string, string>;
  customColumnsOrder: Record<string, string[]>;
  customPinnedColumns: Record<string, GridPinnedColumnFields>;
  customSortingModel: Record<string, GridSortModel>;
  customFilterModel: Record<string, INestedMultiFilterForm>;
  customPaginationModel: Record<string, GridPaginationModel>;
  customColumnsVisibleModel: Record<string, GridColumnVisibilityModel>;
  customColumnDimensions: Record<string, Record<string, GridColumnDimensions>>;
  isDefaultSettingsBlocked: Record<string, boolean>;
  rowGroupingModel: Record<string, GridRowGroupingModel>;
}

const initialState: IInitialState = {
  selectedRows: [],
  selectedRow: null,

  customColumnsModelIds: {},
  customColumnsOrder: {},
  customPinnedColumns: {},
  customFilterModel: {},
  customSortingModel: {},
  customPaginationModel: {},
  customColumnsVisibleModel: {},
  customColumnDimensions: {},
  isDefaultSettingsBlocked: {},
  rowGroupingModel: {},
};

const processManagerTableSlice = createSlice({
  name: 'processManagerTable',
  initialState,
  reducers: {
    setSelectedRows: (s, a: PayloadAction<PmSelectedRow[]>) => {
      s.selectedRows = a.payload;
    },
    setSelectedRow: (s, a: PayloadAction<SeverityProcessModelData | null>) => {
      s.selectedRow = a.payload;
    },

    setCustomColumnsModelIds: (state, action: PayloadAction<{ tmoId: number; id: string }>) => {
      state.customColumnsModelIds[action.payload.tmoId] = action.payload.id;
    },
    setCustomColumnsOrder: (
      state,
      action: PayloadAction<{ tmoId: number; columnsOrder: string[] }>,
    ) => {
      state.customColumnsOrder[action.payload.tmoId] = action.payload.columnsOrder;
    },
    setCustomPinnedColumns: (state, action: PayloadAction<CompositePinnedColumnsItem>) => {
      state.customPinnedColumns[action.payload.tmoId] = action.payload.pinnedColumns;
    },
    setExportDataDelimiter: (state, action: PayloadAction<string>) => {
      state.exportDataDelimiter = action.payload;
    },
    setCustomSortingModel: (state, action: PayloadAction<CompositeSortingItem>) => {
      state.customSortingModel[action.payload.tmoId] = action.payload.sorting;
    },
    setCustomFilterModel: (state, action: PayloadAction<CompositeFiltersItem>) => {
      const { selectedFilter, tmoId } = action.payload;
      state.customFilterModel[tmoId] = selectedFilter;
    },

    setCustomPaginationModel: (state, action: PayloadAction<CompositePaginationItem>) => {
      const { tmoId, pagination } = action.payload;
      state.customPaginationModel[tmoId] = pagination;
    },

    setCustomColumnsVisibleModel: (
      state,
      action: PayloadAction<CompositeColumnsVisibilityItem>,
    ) => {
      const { tmoId, visibleColumns } = action.payload;
      state.customColumnsVisibleModel[tmoId] = visibleColumns;
    },
    setCustomColumnDimensions: (state, action: PayloadAction<CompositeColumnDimensionsItem>) => {
      state.customColumnDimensions[action.payload.tmoId] = action.payload.columnDimensions;
    },
    setIsCustomDefaultSettingsBlocked: (
      state,
      action: PayloadAction<CompositeIsDefaultSettingsBlockedItem>,
    ) => {
      state.isDefaultSettingsBlocked[action.payload.tmoId] =
        action.payload.isDefaultSettingsBlocked;
    },
    setCustomRowGroupingModel: (state, action: PayloadAction<CompositeRowGroupingModel>) => {
      state.rowGroupingModel[action.payload.tmoId] = action.payload.rowGroupingModel;
    },
    restore: (_, action: PayloadAction<IInitialState>) => action.payload,
  },
});
export const processManagerTableActions = processManagerTableSlice.actions;
export const processManagerTableReducer = processManagerTableSlice.reducer;
export const processManagerTableSliceName = processManagerTableSlice.name;
