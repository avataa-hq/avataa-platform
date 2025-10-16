import {
  CompositeColumnDimensionsItem,
  CompositeColumnsVisibilityItem,
  CompositeFiltersItem,
  CompositePaginationItem,
  CompositePinnedColumnsItem,
  CompositeRowGroupingModel,
  CompositeSortingItem,
  DEFAULT_COLUMNS_VISIBILITY_MODEL,
  DEFAULT_PAGINATION_MODEL,
  IMenuPosition,
  PmSelectedRow,
  SeverityProcessModelData,
  TablePrototype,
  useProcessManagerTable,
} from '6_shared';
import { MutableRefObject, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { GridApiPremium } from '@mui/x-data-grid-premium/models/gridApiPremium';
import { GridRowParams, GridRowSelectionModel } from '@mui/x-data-grid-premium';
import { GridColDef } from '@mui/x-data-grid-pro';

interface IProps<R extends readonly Record<string, any>[] = readonly Record<string, any>[]> {
  apiRef: MutableRefObject<GridApiPremium>;
  isLoading?: boolean;

  columns?: GridColDef[];
  rows?: R;
  totalRows?: number;

  tmoId?: number;

  contextMenuComponent?: ReactNode;

  onRowClick?: (row: GridRowParams) => void;
  onRowDoubleClick?: () => void;

  contextMenuPosition?: IMenuPosition | null;
  setContextMenuPosition?: (value: IMenuPosition | null) => void;

  isColumnGroups?: boolean;
}
export const ProcessTable = ({
  apiRef,
  isLoading,

  columns,
  rows,
  totalRows,

  tmoId,

  contextMenuComponent,

  onRowClick,
  onRowDoubleClick,

  contextMenuPosition,
  setContextMenuPosition,

  isColumnGroups,
}: IProps) => {
  const [needToAddedSortByGroup, setNeedToAddedSortByGroup] = useState(true);

  const {
    customSortingModel,
    customFilterModel,
    customPaginationModel,
    customColumnsVisibleModel,
    customColumnsOrder,
    customColumnDimensions,
    customPinnedColumns,
    selectedRows,
    rowGroupingModel,

    setCustomColumnsVisibleModel,
    setCustomSortingModel,
    setCustomFilterModel,
    setCustomPaginationModel,
    setSelectedRows,
    setSelectedRow,
    setCustomPinnedColumns,
    setCustomColumnDimensions,
    setCustomRowGroupingModel,
  } = useProcessManagerTable();

  useEffect(() => {
    if (!needToAddedSortByGroup || !tmoId) return;
    const sortByGroup = customSortingModel[tmoId]?.find(({ field }) => field === 'groupName');
    if (!sortByGroup) {
      setCustomSortingModel({
        tmoId,
        sorting: [{ sort: 'asc', field: 'groupName' }, ...(customSortingModel[tmoId] ?? [])],
      });
    }
  }, [customSortingModel, tmoId, needToAddedSortByGroup, setCustomSortingModel]);

  useEffect(() => () => setNeedToAddedSortByGroup(true), [tmoId]);

  // region COLUMNS VISIBILITY
  const setColumnsVisibility = useCallback(
    (visibleModel: CompositeColumnsVisibilityItem) => {
      setCustomColumnsVisibleModel(visibleModel);
    },
    [setCustomColumnsVisibleModel],
  );
  // endregion

  // region FILTERS
  const setTableFilters = useCallback(
    (value: CompositeFiltersItem) => {
      setCustomFilterModel(value);
    },
    [setCustomFilterModel],
  );
  // endregion

  // region SORTING
  const setSorting = useCallback(
    (sortModel: CompositeSortingItem) => {
      setNeedToAddedSortByGroup(false);
      setCustomSortingModel(sortModel);
      // const sortModelByTmo = sortModel.sorting;
      // apiRef.current.setSortModel(sortModelByTmo);
    },
    [setCustomSortingModel],
  );
  // endregion

  // region PAGINATION
  const setPagination = useCallback(
    (pagination: CompositePaginationItem) => {
      setCustomPaginationModel(pagination);
    },
    [setCustomPaginationModel],
  );
  // endregion

  // region PINNED COLUMNS
  const setPinnedColumns = useCallback(
    (pinnedColumns: CompositePinnedColumnsItem) => {
      setCustomPinnedColumns(pinnedColumns);
    },
    [setCustomPinnedColumns],
  );
  // endregion

  // region COLUMN DIMENSION
  const setColumnDimensions = useCallback(
    (dimensions: CompositeColumnDimensionsItem) => {
      setCustomColumnDimensions(dimensions);
    },
    [setCustomColumnDimensions],
  );
  // endregion

  // region ROWS GROUPING
  const setRowGroupingModel = useCallback(
    (rowGrouping: CompositeRowGroupingModel) => {
      setCustomRowGroupingModel(rowGrouping);
    },
    [setCustomRowGroupingModel],
  );

  // endregion

  const transformObject = useCallback(
    (obj: Record<string, any>) =>
      Object.entries(obj).reduce<Partial<SeverityProcessModelData>>((acc, [key, value]) => {
        const isNumericKey = !Number.isNaN(+key) && Number.isInteger(+key);
        if (!acc.parameters) {
          acc.parameters = {};
        }

        if (isNumericKey) {
          acc.parameters[key] = value;
        } else {
          acc[key] = value;
        }

        return acc;
      }, {}),
    [],
  );

  // region ROW EVENTS
  const handleSelectedRows = useCallback(
    (rowsData: GridRowSelectionModel, event?: React.MouseEvent) => {
      // if (event?.button === 2) return;
      const pmRowData: PmSelectedRow[] = rowsData.flatMap((rd) => {
        const dataFromRows = rows?.find((r) => String(r.id) === String(rd));

        if (!dataFromRows) return [];

        const newObject = transformObject(dataFromRows);

        return {
          ...newObject,
          isActive: dataFromRows.active,
          id: rd,
          name: dataFromRows.name,
        } satisfies PmSelectedRow;
      });

      const filteredRows = pmRowData.filter((rd) => rowsData.some((r) => r === rd.id));

      setSelectedRows(filteredRows);

      const lastRowId = rowsData.at(-1);
      const neededRow = rows?.find((r) => String(r.id) === String(lastRowId));

      if (neededRow) setSelectedRow(neededRow as SeverityProcessModelData);
    },
    [setSelectedRows, setSelectedRow, rows, transformObject],
  );
  // endregion

  const prototypeSelectedRows = useMemo(() => selectedRows.map(({ id }) => id), [selectedRows]);

  const columnsByOrder = useMemo(() => {
    if (!tmoId || !customColumnsOrder?.[tmoId]) return columns;

    const order = customColumnsOrder[tmoId];
    return [...(columns ?? [])].sort((a, b) => {
      const indexA = order.indexOf(a.field);
      const indexB = order.indexOf(b.field);

      return indexA - indexB;
    });
  }, [columns, customColumnsOrder, tmoId]);

  const onRightClick = useCallback(
    (rowId?: number) => {
      if (!rowId) return;
      const neededRow = rows?.find((r) => String(r.id) === String(rowId));
      if (!neededRow) return;

      const hasRowInSelected = !!selectedRows.find((row) => String(row.id) === String(rowId));
      const newObject = transformObject(neededRow);

      if (!hasRowInSelected) {
        setSelectedRows([
          ...selectedRows,
          {
            ...newObject,
            id: neededRow.id,
            name: neededRow.name,
            isActive: neededRow.active,
          } satisfies PmSelectedRow,
        ]);
      } else {
        setSelectedRow(newObject as any);
      }
    },
    [setSelectedRow, setSelectedRows, rows, selectedRows, transformObject],
  );

  return (
    <TablePrototype
      apiRef={apiRef}
      visibleColumns={customColumnsVisibleModel}
      setColumnsVisibility={setColumnsVisibility}
      pinnedColumns={customPinnedColumns}
      setPinnedColumns={setPinnedColumns}
      defaultColumnVisibilityModel={DEFAULT_COLUMNS_VISIBILITY_MODEL}
      selectedFilter={customFilterModel}
      setTableFilters={setTableFilters}
      sorting={customSortingModel}
      setSorting={setSorting}
      columns={columnsByOrder ?? []}
      rows={rows as any[]}
      tmoId={tmoId}
      isLoading={isLoading}
      pagination={customPaginationModel}
      setPagination={setPagination}
      defaultPaginationModel={DEFAULT_PAGINATION_MODEL}
      paginationOptions={[15, 30, 50, 100]}
      rowCount={totalRows ?? 0}
      isColumnGroups={isColumnGroups}
      contextMenuComponent={contextMenuComponent}
      contextMenu={contextMenuPosition}
      setContextMenu={setContextMenuPosition}
      onRowClick={onRowClick}
      onRowDoubleClick={onRowDoubleClick}
      selectedRows={prototypeSelectedRows}
      setSelectedRows={handleSelectedRows}
      onRightClick={onRightClick}
      setColumnDimensions={setColumnDimensions}
      columnDimensions={customColumnDimensions}
      rowGroupingModel={rowGroupingModel}
      setRowGroupingModel={setRowGroupingModel}
    />
  );
};
