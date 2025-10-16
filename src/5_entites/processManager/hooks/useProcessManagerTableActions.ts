import {
  CompositeSortingItem,
  CompositeColumnsOrderItem,
  CompositeColumnsVisibilityItem,
  CompositePinnedColumnsItem,
  CompositeColumnDimensionsItem,
  CompositeIsDefaultSettingsBlockedItem,
  useProcessManagerTable,
} from '6_shared';

export const useProcessManagerTableActions = () => {
  const {
    setCustomSortingModel,
    setCustomColumnsOrder,
    setCustomColumnDimensions,
    setCustomColumnsVisibleModel,
    setCustomPinnedColumns,
    setIsCustomDefaultSettingsBlocked,
  } = useProcessManagerTable();

  const handleSetCustomSortingModel = (order: CompositeSortingItem) => setCustomSortingModel(order);

  const handleSetCustomColumnsOrder = (order: CompositeColumnsOrderItem) =>
    setCustomColumnsOrder(order);

  const handleSetCustomColumnDimensions = (dimensions: CompositeColumnDimensionsItem) =>
    setCustomColumnDimensions(dimensions);

  const handleSetCustomVisibleColumns = (columns: CompositeColumnsVisibilityItem) =>
    setCustomColumnsVisibleModel(columns);

  const handleSetPinnedColumns = (pinnedColumns: CompositePinnedColumnsItem) => {
    setCustomPinnedColumns(pinnedColumns);
  };

  const handleSetIsDefaultSettingsBlocked = (isBlocked: CompositeIsDefaultSettingsBlockedItem) =>
    setIsCustomDefaultSettingsBlocked(isBlocked);
  return {
    handleSetCustomSortingModel,
    handleSetCustomColumnsOrder,
    handleSetCustomColumnDimensions,
    handleSetCustomVisibleColumns,
    handleSetPinnedColumns,
    handleSetIsDefaultSettingsBlocked,
  };
};
