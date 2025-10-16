import {
  ActionTypes,
  DEFAULT_PAGINATION_MODEL,
  defaultColumnVisibilityModel,
  GetNodesByMoIdModel,
  PAGINATION_OPTIONS,
  TablePrototype,
  useAssociatedObjects,
} from '6_shared';
import { GridColDef } from '@mui/x-data-grid-premium';
import { MutableRefObject, useState } from 'react';
import { GridApiPremium } from '@mui/x-data-grid-premium/models/gridApiPremium';
import { useContextMenuItems, useGetInventoryObjectData } from '5_entites';
import { useContextMenu } from '2_pages/inventory/lib';
import { DiagramContextMenuItem } from '5_entites/inventory/ui/table/DiagramContextMenuItem';
import { GridRowsProp } from '@mui/x-data-grid/models/gridRows';
import { useDetailedTableHandleActions } from '../../lib/useDetailedTableHandleActions';

interface DetailedTableProps {
  columns: GridColDef[];
  rows: GridRowsProp;
  tmoId: number;
  totalCount: number;
  apiRef: MutableRefObject<GridApiPremium>;
  isLoading?: boolean;
  permissions?: Record<ActionTypes, boolean>;
  setIsFindPathOpen?: (value: boolean) => void;
}

export const DetailedTable = ({
  columns,
  rows,
  tmoId,
  totalCount,
  apiRef,
  isLoading,
  permissions,
  setIsFindPathOpen,
}: DetailedTableProps) => {
  const {
    detailedView: {
      pagination,
      visibleColumns,
      rightClickedRowId,
      selectedRows,
      sorting,
      filters,
      isCheckboxSelection,
      columnDimensions,
      pinnedColumns,
    },
    setDetailedViewRightClickedRowId,
  } = useAssociatedObjects();

  const {
    handleSetPagination,
    handleSetColumnsVisibility,
    handleSetFilters,
    handleSetSorting,
    handleSetIsCheckboxSelection,
    handleSetSelectedRows,
    handleSetColumnDimensions,
    handleSetColumnsOrder,
    handleSetPinnedColumns,
  } = useDetailedTableHandleActions();

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const { inventoryObjectData } = useGetInventoryObjectData({
    objectId: rightClickedRowId,
  });

  const { handleContextMenuItemClick: onMenuItemClick } = useContextMenu({
    tmoId,
    inventoryObjectData: inventoryObjectData!,
    setIsFindPathOpen,
  });

  const menuItems = useContextMenuItems({
    rightClickedRowId,
    onMenuItemClick,
    permissions,
  });

  const onDiagramContextMenuItemClick = (value: GetNodesByMoIdModel) => {
    onMenuItemClick?.('Show in diagram', value);
    setContextMenu(null);
  };

  return (
    <TablePrototype
      columns={columns}
      rows={rows}
      apiRef={apiRef}
      tmoId={tmoId}
      pagination={pagination}
      paginationOptions={PAGINATION_OPTIONS}
      defaultPaginationModel={DEFAULT_PAGINATION_MODEL}
      setPagination={handleSetPagination}
      rowCount={totalCount}
      visibleColumns={visibleColumns}
      setColumnsVisibility={handleSetColumnsVisibility}
      defaultColumnVisibilityModel={defaultColumnVisibilityModel}
      setTableFilters={handleSetFilters}
      selectedFilter={filters}
      sorting={sorting}
      setSorting={handleSetSorting}
      setRightClickedRowId={(id) => setDetailedViewRightClickedRowId(id)}
      selectedRows={selectedRows}
      setSelectedRows={handleSetSelectedRows}
      isLoading={isLoading}
      contextMenu={contextMenu}
      setContextMenu={setContextMenu}
      menuItems={menuItems}
      isCheckBoxRowSelection={isCheckboxSelection}
      setIsCheckBoxRowSelection={handleSetIsCheckboxSelection}
      columnDimensions={columnDimensions}
      setColumnDimensions={handleSetColumnDimensions}
      setColumnsOrder={handleSetColumnsOrder}
      pinnedColumns={pinnedColumns}
      setPinnedColumns={handleSetPinnedColumns}
      contextMenuComponent={
        <DiagramContextMenuItem
          onClick={onDiagramContextMenuItemClick}
          objectId={rightClickedRowId!}
        />
      }
    />
  );
};
