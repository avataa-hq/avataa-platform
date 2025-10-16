import {
  CompositeColumnDimensionsItem,
  CompositeColumnsOrderItem,
  CompositeColumnsVisibilityItem,
  CompositeFiltersItem,
  CompositePaginationItem,
  CompositePinnedColumnsItem,
  CompositeSortingItem,
  useAssociatedObjects,
} from '6_shared';
import { GridRowSelectionModel } from '@mui/x-data-grid-premium';

export const useDetailedTableHandleActions = () => {
  const {
    setDetailedViewColumns,
    setDetailedViewFilters,
    setDetailedViewPagination,
    setDetailedViewSorting,
    setIsCheckboxSelection,
    setSelectedRows,
    setColumnDimensions,
    setColumnsOrder,
    setPinnedColumns,
  } = useAssociatedObjects();

  const handleSetPagination = (value: CompositePaginationItem) => {
    setDetailedViewPagination(value);
  };

  const handleSetColumnsVisibility = (value: CompositeColumnsVisibilityItem) => {
    setDetailedViewColumns(value);
  };

  const handleSetFilters = (value: CompositeFiltersItem) => {
    setDetailedViewFilters(value);
  };

  const handleSetSorting = (value: CompositeSortingItem) => {
    setDetailedViewSorting(value);
  };

  const handleSetIsCheckboxSelection = (value: boolean) => setIsCheckboxSelection(value);

  const handleSetSelectedRows = (selectedRows: GridRowSelectionModel) =>
    setSelectedRows(selectedRows);

  const handleSetColumnDimensions = (dimensions: CompositeColumnDimensionsItem) =>
    setColumnDimensions(dimensions);

  const handleSetColumnsOrder = (order: CompositeColumnsOrderItem) => setColumnsOrder(order);

  const handleSetPinnedColumns = (pinnedColumns: CompositePinnedColumnsItem) =>
    setPinnedColumns(pinnedColumns);

  return {
    handleSetPagination,
    handleSetColumnsVisibility,
    handleSetFilters,
    handleSetSorting,
    handleSetIsCheckboxSelection,
    handleSetSelectedRows,
    handleSetColumnDimensions,
    handleSetColumnsOrder,
    handleSetPinnedColumns,
  };
};
