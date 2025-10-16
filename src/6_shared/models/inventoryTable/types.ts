import {
  GridColumnVisibilityModel,
  GridPaginationModel,
  GridPinnedColumnFields,
  GridRowGroupingModel,
  GridRowSelectionModel,
  GridSortModel,
} from '@mui/x-data-grid-premium';
import { INestedMultiFilterForm, InventoryParameterTypesModel } from '6_shared';
import { GridColumnDimensions } from '@mui/x-data-grid/hooks/features/columns/gridColumnsInterfaces';

export type DataTransferFileExtension = 'csv' | 'xls' | 'xlsx';

export interface IInventoryTableData {
  filters: Record<string, INestedMultiFilterForm>;
  visibleColumns: Record<string, GridColumnVisibilityModel>;
  pagination: Record<string, GridPaginationModel>;
  sorting: Record<string, GridSortModel>;
  selectedRows: GridRowSelectionModel;
  rightClickedRowId: number | null;
  searchValue: Record<string, string>;
  isCustomFiltersSetActive: Record<string, boolean>;
  isCustomColumnsSetActive: Record<string, boolean>;
  customColumnsOrder: Record<string, string[]>;
  exportDataDelimiter?: string;
  isParentsData: boolean;
  selectedFilter: Record<string, INestedMultiFilterForm>;
  columnDimensions: Record<string, Record<string, GridColumnDimensions>>;
  pinnedColumns: Record<string, GridPinnedColumnFields>;
  isDefaultSettingsBlocked: Record<string, boolean>;
  isCheckboxSelection: boolean;
  rowGroupingModel: Record<string, GridRowGroupingModel>;
}

export interface IMultipleEditOptions extends InventoryParameterTypesModel {
  tprm_id: number;
  value: any;
}
