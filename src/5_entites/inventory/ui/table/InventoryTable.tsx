import {
  TablePrototype,
  ActionTypes,
  GetNodesByMoIdModel,
  DEFAULT_PAGINATION_MODEL,
  PAGINATION_OPTIONS,
  defaultColumnVisibilityModel,
  useInventoryTable,
} from '6_shared';
import { GridColDef, GridRowParams } from '@mui/x-data-grid-premium';
import { MutableRefObject, useState } from 'react';
import { GridApiPremium } from '@mui/x-data-grid-premium/models/gridApiPremium';
import { GridRowsProp } from '@mui/x-data-grid/models/gridRows';
import { useContextMenuItems, useInventoryTableHandleActions } from '../../lib';
import { DiagramContextMenuItem } from './DiagramContextMenuItem';
import { InventoryContextMenuClickEventHandler } from '../../model';

interface IProps {
  columns: GridColDef[];
  rows: GridRowsProp;
  tmoId?: number;
  apiRef: MutableRefObject<GridApiPremium>;
  rowCount: number;
  isLoading?: boolean;
  onMenuItemClick: InventoryContextMenuClickEventHandler;
  onRowClick?: (row: GridRowParams) => void;
  permissions?: Record<ActionTypes, boolean>;
}

export const InventoryTable = ({
  columns,
  rows,
  tmoId,
  apiRef,
  rowCount,
  isLoading,
  onMenuItemClick,
  onRowClick,
  permissions,
}: IProps) => {
  const {
    visibleColumns,
    pagination,
    sorting,
    selectedRows,
    rightClickedRowId,
    selectedFilter,
    pinnedColumns,
    columnDimensions,
    isCheckboxSelection,
    rowGroupingModel,
  } = useInventoryTable();

  const {
    handleSetPagination,
    handleSetColumnsVisibility,
    handleSetFilters,
    handleSetIsCustomFilters,
    handleSetSorting,
    handleSetPinnedColumns,
    handleSetColumnsOrder,
    handleSetColumnDimensions,
    handleSetIsCheckboxSelection,
    handleSetRowGroupingModel,
    handleSetRightClickedRowId,
    handleSetSelectedRows,
  } = useInventoryTableHandleActions();

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

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
      rowCount={rowCount}
      isColumnGroups
      visibleColumns={visibleColumns}
      setColumnsVisibility={handleSetColumnsVisibility}
      defaultColumnVisibilityModel={defaultColumnVisibilityModel}
      pinnedColumns={pinnedColumns}
      setPinnedColumns={handleSetPinnedColumns}
      setTableFilters={handleSetFilters}
      setIsCustomFilters={handleSetIsCustomFilters}
      selectedFilter={selectedFilter}
      sorting={sorting}
      setSorting={handleSetSorting}
      setRightClickedRowId={handleSetRightClickedRowId}
      selectedRows={selectedRows}
      setSelectedRows={handleSetSelectedRows}
      isLoading={isLoading}
      contextMenu={contextMenu}
      setContextMenu={setContextMenu}
      menuItems={menuItems}
      setColumnsOrder={handleSetColumnsOrder}
      setColumnDimensions={handleSetColumnDimensions}
      columnDimensions={columnDimensions}
      isCheckBoxRowSelection={isCheckboxSelection}
      setIsCheckBoxRowSelection={handleSetIsCheckboxSelection}
      rowGroupingModel={rowGroupingModel}
      setRowGroupingModel={handleSetRowGroupingModel}
      contextMenuComponent={
        <DiagramContextMenuItem
          onClick={onDiagramContextMenuItemClick}
          objectId={rightClickedRowId!}
        />
      }
      onRowClick={onRowClick}
    />
  );
};
