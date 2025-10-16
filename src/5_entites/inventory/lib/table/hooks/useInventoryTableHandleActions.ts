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
  useInventoryTable,
} from '6_shared';
import { GridRowSelectionModel } from '@mui/x-data-grid-premium';

export const useInventoryTableHandleActions = () => {
  const {
    setColumnDimensions,
    setColumnsOrder,
    setIsCustomColumnsSetActive,
    setIsCustomFiltersSetActive,
    setIsDefaultSettingsBlocked,
    setPagination,
    setPinnedColumns,
    setSelectedFilter,
    setSorting,
    setVisibleColumns,
    setIsCheckboxSelection,
    setSelectedRows,
    setRowGroupingModel,
    setRightClickedRowId,
  } = useInventoryTable();

  const handleSetPagination = (value: CompositePaginationItem) => {
    setPagination(value);
  };

  const handleSetColumnsVisibility = (value: CompositeColumnsVisibilityItem) => {
    setVisibleColumns(value);
  };

  const handleSetFilters = (value: CompositeFiltersItem) => {
    setSelectedFilter(value);
  };

  const handleSetIsCustomFilters = (value: CompositeIsCustomFilters) => {
    setIsCustomFiltersSetActive(value);
  };

  const handleSetSorting = (value: CompositeSortingItem) => {
    setSorting(value);
  };

  const handleSetColumnDimensions = (dimensions: CompositeColumnDimensionsItem) =>
    setColumnDimensions(dimensions);

  const handleSetColumnsOrder = (order: CompositeColumnsOrderItem) => setColumnsOrder(order);

  const handleSetIsActiveCustomColumnsSet = (isActive: CompositeIsCustomColumnsSetActiveItem) =>
    setIsCustomColumnsSetActive(isActive);

  const handleSetPinnedColumns = (pinnedColumns: CompositePinnedColumnsItem) =>
    setPinnedColumns(pinnedColumns);

  const handleSetIsDefaultSettingsBlocked = (isBlocked: CompositeIsDefaultSettingsBlockedItem) =>
    setIsDefaultSettingsBlocked(isBlocked);

  const handleSetIsCheckboxSelection = (isCheckboxSelection: boolean) =>
    setIsCheckboxSelection(isCheckboxSelection);

  const handleSetSelectedRows = (selectedRows: GridRowSelectionModel) =>
    setSelectedRows(selectedRows);

  const handleSetRowGroupingModel = (rowGroupingModel: CompositeRowGroupingModel) =>
    setRowGroupingModel(rowGroupingModel);

  const handleSetRightClickedRowId = (rowGroupingModel: number) =>
    setRightClickedRowId(rowGroupingModel);

  return {
    handleSetPagination,
    handleSetColumnsVisibility,
    handleSetFilters,
    handleSetIsCustomFilters,
    handleSetSorting,
    handleSetColumnDimensions,
    handleSetColumnsOrder,
    handleSetIsActiveCustomColumnsSet,
    handleSetPinnedColumns,
    handleSetIsDefaultSettingsBlocked,
    handleSetIsCheckboxSelection,
    handleSetSelectedRows,
    handleSetRowGroupingModel,
    handleSetRightClickedRowId,
  };
};
