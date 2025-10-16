import {
  GridColumnVisibilityModel,
  GridPaginationModel,
  GridPinnedColumnFields,
  GridRowSelectionModel,
  GridSortModel,
} from '@mui/x-data-grid-premium';
import { INestedMultiFilterForm } from '6_shared';
import { GridColumnDimensions } from '@mui/x-data-grid/hooks/features/columns/gridColumnsInterfaces';

export interface IAssociatedObjectsState {
  associatedObjectType: AssociatedObjectsType;
  skipFetching: boolean;
  currentMoId: number | null;
  detailedView: IDetailedView;
  commonView: ICommonView;
  isOpenAssociatedTableModal: boolean;
  objectDataToRequest: NavigationData[];
  selectedObjectRequestData: NavigationData | null;
  objectHistory: { id: number; popupType: AssociatedObjectsType }[];
}

export type AssociatedObjectsType = 'linked' | 'related' | 'children' | null;

interface IDetailedView {
  selectedTmo: number | null;
  composedSelectedTmo: string | null;
  tprmNameWhenOpen: string | null;

  searchValue: Record<string, string>;
  pagination: Record<string, GridPaginationModel>;
  filters: Record<string, INestedMultiFilterForm>;
  sorting: Record<string, GridSortModel>;
  visibleColumns: Record<string, GridColumnVisibilityModel>;
  isObjectsActive: boolean;
  rightClickedRowId: number | null;
  exportDataDelimiter?: string;
  selectedRows: GridRowSelectionModel;
  isCheckboxSelection: boolean;
  columnDimensions: Record<string, Record<string, GridColumnDimensions>>;
  customColumnsOrder: Record<string, string[]>;
  pinnedColumns: Record<string, GridPinnedColumnFields>;
}

interface ICommonView {
  pagination: GridPaginationModel;
}

export interface ComposedSelectedTmoPayload {
  tmoId: number | string;
  tprmName?: string | number;
}

export interface NavigationData {
  id: number;
  associatedType: AssociatedObjectsType;
  active?: boolean;
  order?: number;
}
