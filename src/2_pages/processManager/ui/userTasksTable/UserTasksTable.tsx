import {
  ActionTypes,
  CompositeColumnDimensionsItem,
  CompositeColumnsOrderItem,
  CompositeColumnsVisibilityItem,
  CompositeFiltersItem,
  CompositePaginationItem,
  CompositePinnedColumnsItem,
  CompositeRowGroupingModel,
  CompositeSortingItem,
  DEFAULT_COLUMNS_VISIBILITY_MODEL,
  DEFAULT_PAGINATION_MODEL,
  IMenuPosition,
  InventoryObjectTypesModel,
  Modal,
  ProcessManagerPageMode,
  TablePrototype,
  useConfig,
  useProcessManagerUserTasksTable,
} from '6_shared';
import { CompleteUserTask, History, StreamComments } from '5_entites';
import { GridRowParams, GridRowSelectionModel, useGridApiRef } from '@mui/x-data-grid-premium';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { Tailspin } from 'ldrs/react';
import { IconButton, useTheme } from '@mui/material';
import { GridSortModel } from '@mui/x-data-grid-pro';
import RefreshIcon from '@mui/icons-material/Refresh';
import { CustomTableToolbar, FileViewerWidget } from '3_widgets';
import 'ldrs/react/Tailspin.css';
import { TaskEdit } from '4_features';
import { UserRepresentation } from '6_shared/api/keycloak/users/types';
import { useUserTasksTableData } from '../../lib/hooks/useUserTasksTableData';

interface IProps {
  viewType: ProcessManagerPageMode;
  pmCurrentTmo: InventoryObjectTypesModel | null;

  permissions?: Record<ActionTypes, boolean>;
  usersById: Record<string, UserRepresentation>;

  onRowClick?: (row: GridRowParams) => void;
  onRowDoubleClick?: () => void;

  contextMenuComponent?: ReactNode;
  contextMenuPosition?: IMenuPosition | null;
  setContextMenuPosition?: (value: IMenuPosition | null) => void;

  isCompleteUserTaskOpen: boolean;
  setIsCompleteUserTaskOpen: (value: boolean) => void;
}

export const UserTasksTable = ({
  pmCurrentTmo,
  viewType,

  permissions,
  usersById,

  onRowClick,
  onRowDoubleClick,

  contextMenuComponent,
  contextMenuPosition,
  setContextMenuPosition,

  isCompleteUserTaskOpen,
  setIsCompleteUserTaskOpen,
}: IProps) => {
  const apiRef = useGridApiRef();
  const { palette } = useTheme();

  const {
    selectedRows,
    customColumnDimensions,
    customFilterModel,
    customPinnedColumns,
    customPaginationModel,
    customColumnsVisibleModel,
    rowGroupingModel,
    selectedRow,
    setCustomColumnsVisibleModel,
    setCustomFilterModel,
    setCustomPaginationModel,
    setCustomSortingModel,

    setCustomPinnedColumns,
    setCustomColumnDimensions,
    setCustomRowGroupingModel,
    setCustomColumnsOrder,

    setSelectedRow,
    setSelectedRows,
  } = useProcessManagerUserTasksTable();

  const {
    config: { _disable_timezone_adjustment: disableTimezoneAdjustment },
  } = useConfig();

  const [sortingModel, setSortingModel] = useState<Record<string, GridSortModel>>({});

  const {
    userTaskColumns,
    useTasksTotalRows,
    userTaskRows,
    isFetchingUserTaskData,
    refetchUserTaskData,
    userTaskError,
  } = useUserTasksTableData({
    pmCurrentTmo,
    viewType,
  });

  // region COLUMNS VISIBILITY
  const setColumnsVisibility = useCallback((visibleModel: CompositeColumnsVisibilityItem) => {
    setCustomColumnsVisibleModel(visibleModel);
  }, []);
  // endregion

  // region FILTERS
  const setTableFilters = useCallback((value: CompositeFiltersItem) => {
    setCustomFilterModel(value);
  }, []);
  // endregion

  // region SORTING
  const setSorting = useCallback((sortModel: CompositeSortingItem) => {
    setSortingModel({ [sortModel.tmoId]: sortModel.sorting });
    setCustomSortingModel(sortModel);
  }, []);
  // endregion

  // region PAGINATION
  const setPagination = useCallback((pagination: CompositePaginationItem) => {
    setCustomPaginationModel(pagination);
  }, []);
  // endregion

  // region PINNED COLUMNS
  const setPinnedColumns = useCallback((pinnedColumns: CompositePinnedColumnsItem) => {
    setCustomPinnedColumns(pinnedColumns);
  }, []);
  // endregion

  // region COLUMN DIMENSION
  const setColumnDimensions = useCallback((dimensions: CompositeColumnDimensionsItem) => {
    setCustomColumnDimensions(dimensions);
  }, []);
  // endregion

  // region ROWS GROUPING
  const setRowGroupingModel = useCallback((rowGrouping: CompositeRowGroupingModel) => {
    setCustomRowGroupingModel(rowGrouping);
  }, []);

  // endregion

  const selectedRowsId = useMemo(() => selectedRows.map((r) => r.id), [selectedRows]);

  const selectedUserTaskObjectId = useMemo(() => {
    const taskObjectId = selectedRow?.variables?.find((variable) => variable.name === 'id')?.value;
    return taskObjectId != null ? Number(taskObjectId) : null;
  }, [selectedRow?.variables]);

  const onRightClick = useCallback(
    (rowId?: number) => {
      if (!rowId) return;
      const neededRow = userTaskRows?.find((r) => String(r.id) === String(rowId));
      if (!neededRow) return;

      const hasRowInSelected = !!selectedRows.find((row) => String(row.id) === String(rowId));

      if (!hasRowInSelected) setSelectedRows([...selectedRows, neededRow]);
      setSelectedRow(neededRow);
    },
    [userTaskRows, selectedRows],
  );

  const handleSelectedRows = useCallback(
    (rowsData: GridRowSelectionModel, event?: React.MouseEvent) => {
      if (event?.button === 2) return;
      const pmRowData = rowsData.flatMap((rd) => {
        const dataFromRows = userTaskRows?.find((r) => String(r.id) === String(rd));

        if (!dataFromRows) return [];

        return dataFromRows;
      });

      const filteredRows = pmRowData.filter((rd) => rowsData.some((r) => r === rd.id));

      setSelectedRows(filteredRows);

      const lastRowId = rowsData.at(-1);
      const neededRow = userTaskRows?.find((r) => String(r.id) === String(lastRowId));

      if (neededRow) setSelectedRow(neededRow);
    },
    [userTaskRows],
  );

  const handleSetCustomColumnsOrder = (order: CompositeColumnsOrderItem) =>
    setCustomColumnsOrder(order);

  const handleSetCustomColumnDimensions = (dimensions: CompositeColumnDimensionsItem) =>
    setCustomColumnDimensions(dimensions);

  const handleSetCustomVisibleColumns = (columns: CompositeColumnsVisibilityItem) =>
    setCustomColumnsVisibleModel(columns);

  const handleSetPinnedColumns = (pinnedColumns: CompositePinnedColumnsItem) => {
    setCustomPinnedColumns(pinnedColumns);
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {userTaskError && (
        <div
          style={{
            position: 'absolute',
            top: '55%',
            left: '50%',
            transform: 'translate(-50%, 50%)',
            zIndex: 1000,
          }}
        >
          <IconButton onClick={refetchUserTaskData}>
            <RefreshIcon />
          </IconButton>
        </div>
      )}
      <div style={{ width: '100%', height: '40px' }}>
        <CustomTableToolbar
          apiRef={apiRef}
          tmoId={pmCurrentTmo?.id}
          hasColumnsPanel
          hasCustomColumnsSettingComponent
          setCustomColumnsOrder={handleSetCustomColumnsOrder}
          setCustomColumnDimensions={handleSetCustomColumnDimensions}
          setCustomVisibleColumns={handleSetCustomVisibleColumns}
          setCustomPinnedColumns={handleSetPinnedColumns}
        />
      </div>
      <div style={{ width: '100%', height: 'calc(100% - 40px)' }}>
        <TablePrototype
          apiRef={apiRef}
          columns={userTaskColumns}
          rows={userTaskRows}
          rowCount={useTasksTotalRows}
          defaultColumnVisibilityModel={DEFAULT_COLUMNS_VISIBILITY_MODEL}
          selectedFilter={customFilterModel}
          setTableFilters={setTableFilters}
          sorting={sortingModel}
          setSorting={setSorting}
          tmoId={pmCurrentTmo?.id ?? -1}
          pagination={customPaginationModel}
          setPagination={setPagination}
          defaultPaginationModel={DEFAULT_PAGINATION_MODEL}
          paginationOptions={[15, 30, 50, 100]}
          visibleColumns={customColumnsVisibleModel}
          setColumnsVisibility={setColumnsVisibility}
          pinnedColumns={customPinnedColumns}
          setPinnedColumns={setPinnedColumns}
          contextMenuComponent={contextMenuComponent}
          contextMenu={contextMenuPosition}
          setContextMenu={setContextMenuPosition}
          onRowClick={onRowClick}
          onRowDoubleClick={onRowDoubleClick}
          selectedRows={selectedRowsId}
          setSelectedRows={handleSelectedRows}
          onRightClick={onRightClick}
          setColumnDimensions={setColumnDimensions}
          columnDimensions={customColumnDimensions}
          rowGroupingModel={rowGroupingModel}
          setRowGroupingModel={setRowGroupingModel}
        />
      </div>

      {isFetchingUserTaskData && (
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '10%',
            // transform: 'translate(50%, 50%)',
            zIndex: 10,
            opacity: 1,
          }}
        >
          <Tailspin size="40" stroke="5" speed="0.5" color={palette.info.main} />
        </div>
      )}

      <Modal
        open={isCompleteUserTaskOpen}
        onClose={() => setIsCompleteUserTaskOpen(false)}
        width="60%"
        minWidth="800px"
      >
        {selectedUserTaskObjectId && (
          <TaskEdit
            objectId={selectedUserTaskObjectId}
            rightSlot={
              <CompleteUserTask
                selectedUserTask={selectedRow}
                onAfterSubmit={() => {
                  setIsCompleteUserTaskOpen(false);
                }}
              />
            }
            footerSlots={{
              attachmentComponent: (
                <FileViewerWidget
                  objectId={selectedUserTaskObjectId}
                  permissions={permissions}
                  isKanban
                />
              ),
              commentsComponent: (
                <StreamComments objectId={selectedUserTaskObjectId} usersData={usersById} />
              ),
              historyComponent: (
                <History
                  objectId={selectedUserTaskObjectId}
                  disableTimezoneAdjustment={disableTimezoneAdjustment}
                  disabledHeader
                  disabledOverflow
                  enableHiddenResponseSettings
                />
              ),
            }}
          />
        )}
      </Modal>
    </div>
  );
};
