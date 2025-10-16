import {
  TablePrototype,
  ActionTypes,
  CompositeColumnsVisibilityItem,
  CompositeFiltersItem,
  CompositePaginationItem,
  CompositeSortingItem,
  PAGINATION_OPTIONS,
  DEFAULT_PAGINATION_MODEL,
  useDataAudit,
  IDataAuditRow,
  defaultDataAuditColumnVisibilityModel,
} from '6_shared';
import { GridColDef, GridRowParams } from '@mui/x-data-grid-premium';
import { MutableRefObject } from 'react';
import { GridApiPremium } from '@mui/x-data-grid-premium/models/gridApiPremium';
import { GridRowsProp } from '@mui/x-data-grid/models/gridRows';
import { useDataAuditContextMenu } from '../../lib';
import { DataAuditContextMenuComponent } from '../contextMenu/DataAuditContextMenuComponent';

interface IProps {
  columns: GridColDef[];
  rows: GridRowsProp;
  apiRef: MutableRefObject<GridApiPremium>;
  rowCount: number;
  // tmoId?: number;
  isLoading?: boolean;
  // onMenuItemClick?: InventoryContextMenuClickEventHandler;
  // onRowClick?: (row: GridRowParams) => void;
  permissions?: Record<ActionTypes, boolean>;
}

export const AdminDataAuditTable = ({
  columns,
  rows,
  // tmoId,
  apiRef,
  rowCount,
  isLoading,
  // onMenuItemClick,
  // onRowClick,
  permissions,
}: IProps) => {
  const {
    customPagination,
    customFilter,
    customSorting,
    selectedRow,
    setCustomPagination,
    setCustomSorting,
    setCustomFilter,
    setSelectedRow,
  } = useDataAudit();

  const { contextMenuPosition, setContextMenuPosition, onContextMenuItemClick } =
    useDataAuditContextMenu({ selectedRow });

  const setColumnsVisibility = (visibleModel: CompositeColumnsVisibilityItem) => {
    // (setCustomColumnsVisibleModel(visibleModel));
  };

  const setTableFilters = (value: CompositeFiltersItem) => {
    setCustomFilter(value);
  };

  const setSorting = (sortModel: CompositeSortingItem) => {
    setCustomSorting(sortModel);
  };

  const setPagination = (pagination: CompositePaginationItem) => {
    setCustomPagination(pagination);
  };

  // const setPinnedColumns = (pinnedColumns: CompositePinnedColumnsItem) => {
  //   // (setCustomPinnedColumns(pinnedColumns));
  // };

  // const setColumnDimensions = (dimensions: CompositeColumnDimensionsItem) => {
  //   // (setCustomColumnDimensions(dimensions));
  // };

  const onRowClick = (rowData: GridRowParams) => {
    const row = rowData.row as IDataAuditRow;
    setSelectedRow(row);
  };

  const onRowRightClick = (rowId?: number) => {
    const row = rows.find((r) => String(r.id) === String(rowId)) as IDataAuditRow;
    setSelectedRow(row);
  };

  return (
    <TablePrototype
      columns={columns}
      rows={rows}
      apiRef={apiRef}
      tmoId={1}
      pagination={customPagination}
      paginationOptions={PAGINATION_OPTIONS}
      defaultPaginationModel={DEFAULT_PAGINATION_MODEL}
      setPagination={setPagination}
      rowCount={rowCount}
      // isColumnGroups
      visibleColumns={{}}
      setColumnsVisibility={setColumnsVisibility}
      defaultColumnVisibilityModel={defaultDataAuditColumnVisibilityModel}
      // pinnedColumns={pinnedColumns}
      // setPinnedColumns={setPinnedColumns}
      setTableFilters={setTableFilters}
      // setIsCustomFilters={handleSetIsCustomFilters}
      selectedFilter={customFilter}
      sorting={customSorting}
      setSorting={setSorting}
      // setRightClickedRowId={handleSetRightClickedRowId}
      // selectedRows={selectedRows}
      // setSelectedRows={handleSetSelectedRows}
      isLoading={isLoading}
      // menuItems={menuItems}
      // setColumnsOrder={handleSetColumnsOrder}
      // setColumnDimensions={handleSetColumnDimensions}
      // columnDimensions={columnDimensions}
      // isCheckBoxRowSelection={isCheckboxSelection}
      // setIsCheckBoxRowSelection={handleSetIsCheckboxSelection}
      // rowGroupingModel={rowGroupingModel}
      // setRowGroupingModel={handleSetRowGroupingModel}
      onRightClick={onRowRightClick}
      contextMenu={contextMenuPosition}
      setContextMenu={setContextMenuPosition}
      contextMenuComponent={
        <DataAuditContextMenuComponent
          onContextMenuItemClick={onContextMenuItemClick}
          selectedRow={selectedRow}
        />
      }
      onRowClick={onRowClick}
    />
  );
};
