import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GridPaginationModel, GridSortModel } from '@mui/x-data-grid-premium';
import {
  CompositeFiltersItem,
  CompositePaginationItem,
  CompositeSortingItem,
  INestedMultiFilterForm,
} from '6_shared';
import { IDataAuditRow } from './types';

interface IInitialState {
  customFilter: Record<string, INestedMultiFilterForm>;
  customPagination: Record<string, GridPaginationModel>;
  customSorting: Record<string, GridSortModel>;
  selectedRow: IDataAuditRow | null;
}

const initialState: IInitialState = {
  customFilter: {},
  customPagination: {},
  customSorting: {},
  selectedRow: null,
};

const dataAuditSlice = createSlice({
  name: 'dataAudit',
  initialState,
  reducers: {
    setCustomPagination: (state, action: PayloadAction<CompositePaginationItem>) => {
      const { tmoId, pagination } = action.payload;
      state.customPagination[tmoId] = pagination;
    },

    setCustomSorting: (state, action: PayloadAction<CompositeSortingItem>) => {
      state.customSorting[action.payload.tmoId] = action.payload.sorting;
    },

    setCustomFilter: (state, action: PayloadAction<CompositeFiltersItem>) => {
      state.customFilter[action.payload.tmoId] = action.payload.selectedFilter;
    },

    setSelectedRow: (state, action: PayloadAction<IDataAuditRow | null>) => {
      state.selectedRow = action.payload;
    },

    restore: (_, action) => action.payload,
  },
});

export const dataAuditActions = dataAuditSlice.actions;
export const dataAuditReducer = dataAuditSlice.reducer;
export const dataAuditSliceName = dataAuditSlice.name;
