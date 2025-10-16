import {
  GridColumnVisibilityModel,
  GridPaginationModel,
  GridPinnedColumnFields,
  GridRowGroupingModel,
  GridSortModel,
} from '@mui/x-data-grid-premium';
import { GridColumnDimensions } from '@mui/x-data-grid/hooks/features/columns/gridColumnsInterfaces';
import { INestedMultiFilterForm } from '../../ui';

export interface CompositePaginationItem {
  tmoId: number;
  pagination: GridPaginationModel;
}

export interface CompositeColumnsVisibilityItem {
  tmoId: number;
  visibleColumns: GridColumnVisibilityModel;
}

export interface CompositeFiltersItem {
  tmoId: number;
  selectedFilter: INestedMultiFilterForm;
}

export interface CompositeIsCustomFilters {
  tmoId: number;
  isCustomFiltersSetActive: boolean;
}

export interface CompositeSortingItem {
  tmoId: number;
  sorting: GridSortModel;
}

export interface CompositeColumnsOrderItem {
  tmoId: number;
  columnsOrder: string[];
}

export interface CompositeIsCustomColumnsSetActiveItem {
  tmoId: number;
  isCustomColumnsSetActive: boolean;
}

export interface CompositePinnedColumnsItem {
  tmoId: number;
  pinnedColumns: GridPinnedColumnFields;
}
export interface CompositeIsDefaultSettingsBlockedItem {
  tmoId: number;
  isDefaultSettingsBlocked: boolean;
}

export interface CompositeColumnDimensionsItem {
  tmoId: number;
  columnDimensions: Record<string, GridColumnDimensions>;
}

export interface CompositeRowGroupingModel {
  tmoId: number;
  rowGroupingModel: GridRowGroupingModel;
}
