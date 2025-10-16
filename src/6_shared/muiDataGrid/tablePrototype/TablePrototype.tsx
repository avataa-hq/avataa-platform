import {
  GridColDef,
  GridColumnsPanel,
  GridColumnVisibilityModel,
  GridEventListener,
  GridPaginationModel,
  GridRowParams,
  GridRowSelectionModel,
  GridSortModel,
  GRID_AGGREGATION_FUNCTIONS,
  GridPinnedColumnFields,
  gridVisibleColumnFieldsSelector,
  GridRowGroupingModel,
  GridTripleDotsVerticalIcon,
} from '@mui/x-data-grid-premium';
import {
  memo,
  MouseEvent,
  MutableRefObject,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { GridApiPremium } from '@mui/x-data-grid-premium/models/gridApiPremium';
import { GRID_CHECKBOX_SELECTION_FIELD } from '@mui/x-data-grid/colDef/gridCheckboxSelectionColDef';
import { TextField } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { GridColumnDimensions } from '@mui/x-data-grid/hooks/features/columns/gridColumnsInterfaces';
import { GridRowsProp } from '@mui/x-data-grid/models/gridRows';
import { StyledDataGrid } from './DataGridPrototype.styled';
import { GridColumnsPanelWithGroups } from '../columnsPanelWithGroups';
import {
  Box,
  ContextMenuVariant,
  IMenuItem,
  IMenuPosition,
  INestedMultiFilterForm,
} from '../../ui';
import { CustomFilterPanel, filterVisualStateSynchronization } from '../customFilterPanel';
import { getRowClassName } from '../lib/getRowClassName';
import { CustomColumnMenu } from '../cuslomColumnMenu';
import { LoadingOverlay } from './loadingOverlay/LoadingOverlay';
import {
  usePagination,
  useColumnsVisibility,
  useColumnGrouping,
  useFilters,
  useSorting,
  GridColDefWithGroups,
  useGetCustomAggregation,
  useRowGrouping,
} from '../lib/hooks';
import {
  CompositeColumnDimensionsItem,
  CompositeColumnsOrderItem,
  CompositeColumnsVisibilityItem,
  CompositeFiltersItem,
  CompositeIsCustomFilters,
  CompositePaginationItem,
  CompositePinnedColumnsItem,
  CompositeRowGroupingModel,
  CompositeSortingItem,
  DATA_GRID_ROW_HEIGHT,
  HAS_FILE,
} from '../model';
import { CustomPagination } from '../customPagination';
import { NoRowsOverlay } from './noRowsOverlay/NoRowsOverlay';
import { usePinnedColumns } from '../lib/hooks/usePinnedColumns';

interface ITablePrototype {
  columns?: GridColDef[];
  rows?: GridRowsProp;

  apiRef: MutableRefObject<GridApiPremium>;
  tmoId?: number;
  isLoading?: boolean;

  pagination?: Record<string, GridPaginationModel>;
  defaultPaginationModel?: GridPaginationModel;
  paginationOptions?: number[];
  setPagination?: (pagination: CompositePaginationItem) => void;
  rowCount?: number;

  isColumnGroups?: boolean;

  visibleColumns: Record<string, GridColumnVisibilityModel>;
  defaultColumnVisibilityModel: GridColumnVisibilityModel;
  setColumnsVisibility: (value: CompositeColumnsVisibilityItem) => void;

  pinnedColumns?: Record<string, GridPinnedColumnFields>;
  setPinnedColumns?: (value: CompositePinnedColumnsItem) => void;

  setTableFilters: (value: CompositeFiltersItem) => void;
  setIsCustomFilters?: (value: CompositeIsCustomFilters) => void;
  selectedFilter: Record<string, INestedMultiFilterForm>;

  sorting?: Record<string, GridSortModel>;
  setSorting?: (value: CompositeSortingItem) => void;

  onRowClick?: (row: GridRowParams) => void;
  setRightClickedRowId?: (arg: number) => void;
  onRightClick?: (rowId?: number) => void;
  onRowDoubleClick?: () => void;
  selectedRows?: GridRowSelectionModel;
  setSelectedRows?: (arg: GridRowSelectionModel, event?: React.MouseEvent) => void;

  menuItems?: IMenuItem[];
  contextMenuComponent?: ReactNode;
  contextMenu?: IMenuPosition | null;
  setContextMenu?: (value: IMenuPosition | null) => void;

  setColumnsOrder?: (order: CompositeColumnsOrderItem) => void;
  setColumnDimensions?: (dimensions: CompositeColumnDimensionsItem) => void;
  columnDimensions?: Record<string, Record<string, GridColumnDimensions>>;

  isCheckBoxRowSelection?: boolean;
  setIsCheckBoxRowSelection?: (value: boolean) => void;

  rowGroupingModel?: Record<string, GridRowGroupingModel>;
  setRowGroupingModel?: (value: CompositeRowGroupingModel) => void;
}

const CustomMenuIcon = () => {
  return <GridTripleDotsVerticalIcon data-testid="Inventory__menu-icon" />;
};

const getTogglableColumns = (cols: GridColDef[]) => {
  return cols.flatMap((column) => {
    if (column.field === GRID_CHECKBOX_SELECTION_FIELD || column.field === HAS_FILE) return [];

    return column.field;
  });
};

export const TablePrototype = memo(
  ({
    columns = [],
    rows = [],
    apiRef,
    tmoId,
    pagination,
    defaultPaginationModel,
    paginationOptions,
    setPagination,
    rowCount = 1,
    isColumnGroups,
    visibleColumns,
    defaultColumnVisibilityModel,
    setColumnsVisibility,
    pinnedColumns = {},
    setPinnedColumns,
    setTableFilters,
    setIsCustomFilters,
    selectedFilter,
    sorting,
    setSorting,
    setRightClickedRowId,
    onRightClick,
    selectedRows = [],
    setSelectedRows,

    menuItems,
    contextMenuComponent,
    contextMenu,
    setContextMenu,
    isLoading,
    onRowClick,
    onRowDoubleClick,
    setColumnsOrder,
    setColumnDimensions,
    columnDimensions,
    isCheckBoxRowSelection,
    setIsCheckBoxRowSelection,
    rowGroupingModel = {},
    setRowGroupingModel,
  }: ITablePrototype) => {
    // Pagination
    const { changePaginationParam } = usePagination({
      tmoId,
      pagination,
      setPagination,
      defaultPaginationModel,
    });

    // Columns Visibility
    const { onColumnVisibilityModelChange } = useColumnsVisibility({
      tmoId,
      visibleColumns,
      defaultColumnVisibilityModel,
      setColumnsVisibility,
    });

    // Columns Grouping
    const { columnGroupingModel, groupedColumns } = useColumnGrouping({
      columns: columns as GridColDefWithGroups[],
    });

    // Filtering
    const { setFilters, removeFilters } = useFilters({
      tmoId,
      setTableFilters,
      setIsCustomFilters,
    });

    useEffect(() => {
      const currentSelectedFilter = selectedFilter[tmoId ?? '-1'];
      const filterData = filterVisualStateSynchronization(apiRef, currentSelectedFilter);

      if (filterData) {
        setTimeout(() => {
          apiRef?.current?.setFilterModel({ items: filterData.currenGridFilter });
          apiRef?.current?.setFilterLogicOperator(filterData.gridLogical);
        }, 1000);
      }
    }, [apiRef, selectedFilter, tmoId]);

    const sortModel = useMemo(() => {
      return sorting?.[tmoId ?? '-1'] ?? [];
    }, [sorting, tmoId]);

    // Sorting
    const { onColumnMenuSortingItemClick, onColumnHeaderClick } = useSorting({
      tmoId,
      apiRef,
      setTableSorting: setSorting,
      currentModel: sortModel,
    });

    // Pinned Columns
    const { onPinnedColumnsChange } = usePinnedColumns({ tmoId, setPinnedColumns, pinnedColumns });

    // Context Menu
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      const currentRowId = event.currentTarget.getAttribute('data-id');
      if (currentRowId) {
        setRightClickedRowId?.(+currentRowId);

        if (
          selectedRows.length === 0 ||
          (selectedRows.length && !selectedRows.includes(+currentRowId))
        ) {
          setSelectedRows?.([+currentRowId], event);
        }
      }
      setContextMenu?.(
        contextMenu == null ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 } : null,
      );
      onRightClick?.(currentRowId ? +currentRowId : undefined);
    };

    // Checkbox row selection switching
    const muiRowSelectionCheckboxChangeEvent: GridEventListener<'headerSelectionCheckboxChange'> =
      useCallback(
        (_, event) => {
          event.defaultMuiPrevented = true;
          setIsCheckBoxRowSelection?.(false);
          setSelectedRows?.([]);

          if (!visibleColumns || !tmoId) return;

          setColumnsVisibility({
            tmoId,
            visibleColumns: {
              ...visibleColumns[tmoId],
              [HAS_FILE]: true,
            },
          });
        },
        [setColumnsVisibility, setIsCheckBoxRowSelection, setSelectedRows, tmoId, visibleColumns],
      );

    useEffect(() => {
      if (rows && apiRef?.current) {
        apiRef?.current?.subscribeEvent(
          'headerSelectionCheckboxChange',
          muiRowSelectionCheckboxChangeEvent,
        );
      }
    }, [apiRef, muiRowSelectionCheckboxChangeEvent, rows]);

    useEffect(() => {
      setIsCheckBoxRowSelection?.(false);
    }, [tmoId]);

    // Aggregation
    const { customSum, customAvg, customMin, customMax } = useGetCustomAggregation({
      selectedRows,
      apiRef,
    });

    const aggregationFunctions = useMemo(() => {
      return selectedRows.length
        ? {
            sum: customSum,
            avg: customAvg,
            min: customMin,
            max: customMax,
          }
        : GRID_AGGREGATION_FUNCTIONS;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRows]);

    useEffect(() => {
      setSelectedRows?.([]);
    }, [tmoId]);

    // Copy cell
    const onCellKeyDown = async (cell: any, event: any) => {
      const { value } = cell;
      const { ctrlKey, key } = event;
      if (ctrlKey === true && key === 'c') {
        if (value) {
          await navigator.clipboard.writeText(String(value));
          enqueueSnackbar('Cell data was successfully copied.', { variant: 'success' });
        } else {
          enqueueSnackbar('There is no cell value.', { variant: 'error' });
        }
      }
    };

    // Row Grouping
    const { onRowGroupingModelChange } = useRowGrouping({ tmoId, setRowGroupingModel });

    return (
      <Box sx={{ position: 'relative', height: '100%' }}>
        <StyledDataGrid
          key={columns.map((c) => c.field).join('-')}
          columns={columns}
          rows={rows}
          apiRef={apiRef}
          isCheckBoxRowSelection={isCheckBoxRowSelection}
          pagination
          rowCount={rowCount}
          paginationMode="server"
          keepNonExistentRowsSelected
          columnGroupingModel={isColumnGroups ? columnGroupingModel : []}
          columnVisibilityModel={visibleColumns[tmoId ?? '-1']}
          onColumnVisibilityModelChange={onColumnVisibilityModelChange}
          pinnedColumns={pinnedColumns[tmoId ?? '-1']}
          onPinnedColumnsChange={onPinnedColumnsChange}
          sortingMode="server"
          rowHeight={DATA_GRID_ROW_HEIGHT}
          sortModel={sortModel}
          onColumnHeaderClick={(col, e) => {
            onColumnHeaderClick(col, e);
          }}
          checkboxSelection={isCheckBoxRowSelection}
          rowSelectionModel={selectedRows}
          onRowSelectionModelChange={(newSelectionModel: GridRowSelectionModel) => {
            setSelectedRows?.(newSelectionModel);

            const clickedId = newSelectionModel.at(-1);
            if (clickedId) setRightClickedRowId?.(+clickedId);
          }}
          filterMode="server"
          getRowClassName={getRowClassName}
          aggregationFunctions={aggregationFunctions}
          loading={isLoading}
          onRowClick={onRowClick}
          onCellKeyDown={onCellKeyDown}
          onColumnOrderChange={() => {
            setColumnsOrder?.({
              tmoId: tmoId!,
              columnsOrder: gridVisibleColumnFieldsSelector(apiRef),
            });
          }}
          onColumnWidthChange={(colData) => {
            if (!columnDimensions) return;

            const newDimensions = {
              ...columnDimensions[tmoId!],
              [colData.colDef.field]: {
                ...(columnDimensions[tmoId!]?.[colData.colDef.field] ?? {}),
                width: colData.colDef.width,
              },
              // [colData.colDef.field]: {
              //   ...columnDimensions[tmoId!][colData.colDef.field],
              //   width: colData.colDef.width,
              // },
            };
            setColumnDimensions?.({ tmoId: tmoId!, columnDimensions: newDimensions });
          }}
          rowGroupingColumnMode="multiple"
          rowGroupingModel={rowGroupingModel[tmoId ?? '-1']}
          onRowGroupingModelChange={onRowGroupingModelChange}
          slots={{
            baseTextField: TextField,
            pagination: CustomPagination,
            noRowsOverlay: NoRowsOverlay,
            columnsPanel: isColumnGroups ? GridColumnsPanelWithGroups : GridColumnsPanel,
            filterPanel: CustomFilterPanel,
            loadingOverlay: LoadingOverlay,
            columnMenu: CustomColumnMenu,
            columnMenuIcon: CustomMenuIcon,
          }}
          slotProps={{
            columnMenu: {
              onSortItemClick: onColumnMenuSortingItemClick,
            },
            baseTextField: {
              variant: 'outlined',
              label: '',
            },
            baseSelect: {
              variant: 'outlined',
              label: undefined,
            },
            pagination: {
              paginationLimit: tmoId
                ? pagination?.[tmoId]?.pageSize || defaultPaginationModel?.pageSize
                : defaultPaginationModel?.pageSize,
              paginationOffset: tmoId
                ? pagination?.[tmoId]?.page || defaultPaginationModel?.page
                : defaultPaginationModel?.page,
              changePaginationParam,
              paginationOptions,
              totalCount: rowCount,
              isPagination: !!rows.length,
            },
            columnsManagement: isColumnGroups
              ? {
                  getTogglableColumns,
                  groupedColumns,
                  columnsVisibilityModel: visibleColumns[tmoId ?? '-1'],
                  setColumnsModel: onColumnVisibilityModelChange,
                }
              : {
                  getTogglableColumns,
                },
            filterPanel: {
              onApply: setFilters,
              onClearAll: removeFilters,
            },
            row: {
              onContextMenu: handleContextMenu,
              onDoubleClick: onRowDoubleClick,
              style: { cursor: 'context-menu' },
            },
          }}
        />
        <ContextMenuVariant
          contextMenu={contextMenu}
          handleClose={() => setContextMenu?.(null)}
          menuItems={menuItems}
          contentComponent={contextMenuComponent}
        />
      </Box>
    );
  },
);
