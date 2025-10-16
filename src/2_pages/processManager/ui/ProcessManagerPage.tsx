import { useCallback, useEffect, useMemo, useState } from 'react';
import { Dialog } from '@mui/material';
import { GridRowParams, useGridApiRef } from '@mui/x-data-grid-premium';
import {
  RightSidePanel,
  LeftPanel,
  AssociatedObjectsWidget,
  ColorSelecting,
  ColorSettings,
  KanbanBoard,
  NoStatus,
} from '3_widgets';
import {
  CreateGroup,
  AddElementsToGroup,
  DeleteGroup,
  DeleteGroupTemplate,
  StepByStepCreationComponent,
} from '4_features';
import {
  ConfirmDeleteProcessesModal,
  HistoryTable,
  HistoryTableHeader,
  useCloseProcessesAndDeleteGroups,
  ProcessTable,
  ContextMenuComponent,
  CreateObjectComponent,
  useKanbanTaskData,
  useKanbanBoardUserData,
  useContextMenuConfig,
} from '5_entites';
import {
  SidebarLayout,
  useRegistration,
  SeverityProcessModelData,
  DraggableDialog,
  ITableColumnSettingsModel,
  ICamundaUserTaskModel,
  useObjectCRUD,
  useHierarchy,
  useProcessManager,
  ProcessManagerPageMode,
  useProcessManagerTable,
  useProcessManagerUserTasksTable,
  useTabs,
  useColorsConfigure,
  useSeverity,
  useLeftPanelWidget,
} from '6_shared';
import { useGetPermissions } from '6_shared/lib/utils/hasPermission/useGetPermissions';
import { ChangeObjectActivityStatusModal } from '5_entites/inventory/ui/table/changeObjectActivityStatusModal/ChangeObjectActivityStatusModal';
import ErrorBoundary from '5_entites/errorBoundary/ErrorBoundary';
import {
  ProcessManagerContainer,
  MainView,
  MainViewBody,
  TableWrapper,
} from './ProcessManagerPage.styled';
import { useProcessTableContextMenu } from '../lib/hooks/useProcessTableContextMenu';
import { useProcessGroups } from '../lib/hooks/useProcessGroups';
import { useProcessPageResponses } from '../lib/hooks/useProcessPageResponses';
import useColorRangeActions from '../lib/hooks/useColorActions';
import { Header } from './header/Header';
import { useLeftPanelSeverityData } from '../lib/hooks/useLeftPanelSeverityData';
import { useProcessesPageData } from '../lib/hooks/useProcessesPageData';
import { useKanbanStatus } from '../lib/hooks/useKanbanStatus';
import { filterColorRanges } from '../lib/getFilteredColorRanges';
import { WarningObjectsList } from './warningObjectsList/WarningObjectsList';
import { useProcessTableData } from '../lib/hooks/useProcessTableData';
import { UserTasksTable } from './userTasksTable/UserTasksTable';
import { UserRepresentation } from '../../../6_shared/api/keycloak/users/types';

const isUserTask = (
  obj: SeverityProcessModelData | ICamundaUserTaskModel,
): obj is ICamundaUserTaskModel => {
  return (obj as ICamundaUserTaskModel).bpmnProcessId !== undefined;
};

const { Sidebar, Container } = SidebarLayout;

const ProcessManagerPage = () => {
  useRegistration(['processManagerData', 'processManagerTable']);

  const permissions = useGetPermissions('processManager');

  const { selectedTab: activePage } = useTabs();
  const { severityId, severityDirection, selectedColorPalette } = useSeverity();

  const apiRef = useGridApiRef();
  const historyTableApiRef = useGridApiRef();

  const {
    customFilterModel,
    selectedRows,
    selectedRow,
    exportDataDelimiter,
    customColumnDimensions,
  } = useProcessManagerTable();

  const { selectedRows: userTasksSelectedRows, selectedRow: userTasksSelectedRow } =
    useProcessManagerUserTasksTable();

  const { selectedTabs, selectedMultiFilter, multiFilterSetList, multiFilterTmoIds } =
    useLeftPanelWidget();

  const {
    objectCRUDComponentUi: { isObjectCRUDModalOpen },
  } = useObjectCRUD();

  const { isOpenColorSelecting } = useColorsConfigure();

  const {
    selectedColumnForColoring,
    selectedGroup,
    pmTmoId,
    isOpenMapActive,
    isOpenDashboardActive,
    colorRangesData,
    groupedColorRangesData,
    viewType,

    setSelectedGroup,
    setViewType,
  } = useProcessManager();

  const { parentItems, hierarchyFilter, childItems } = useHierarchy();

  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [singleClickTimer, setSingleClickTimer] = useState<NodeJS.Timer | null>(null);
  const [historySearchValue, setHistorySearchValue] = useState<string>('');
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [defaultColumnsSettings, setDefaultColumnsSettings] = useState<
    ITableColumnSettingsModel | undefined
  >();
  const [isCompleteUserTaskOpen, setIsCompleteUserTaskOpen] = useState(false);
  const [pmSelectedRowId, setPmSelectedRowId] = useState<number | null>(null);

  // useEffect(() => {
  //   setPmSelectedRowId(selectedRow && !selectedRow.groupName ? +selectedRow.id : null);
  // }, [selectedRow]);

  const { returnableParamTypes, isParamTypesFetching, pmCurrentTmo } = useProcessesPageData({
    multiFilterTmoIds,
    selectedMultiFilter,
    childItems,
  });

  const { isActiveKanban, kanbanStatuses, statusTprmId } = useKanbanStatus({
    pmCurrentTmo,
    selectedMultiFilter,
  });

  const {
    refetchAll,
    refetchAfterSuccess,
    severityProcessesBody,
    processData: { tableProcessData, isTableProcessesDataFetching, warningRows },
    liveUpdateData: { isLiveDataError, setIsLiveUpdate, isLiveUpdate },
    severityByRangesData: { severityCountWithLive, setSeverityBody },
    hierarchyData,
    severityByFiltersData: {
      severityQuantityDataWithLive,
      isFiltersSeverityCountFetching,
      isFiltersSeverityCountError,
    },
  } = useProcessPageResponses({
    multiFilterSetList,
    activePage,
    pmTmoId,
    selectedTabs,
    selectedGroup,
    selectedMultiFilter,
    filterModel: customFilterModel,
    severityDirection,
    hierarchyFilter,
    parentItems,
    childItems,
    severityId,
    selectedColorPalette,
    skipTableProcessDataResponse: viewType === 'tasks',
  });

  const { kanbanTasks } = useKanbanTaskData({
    pmTableRows: tableProcessData?.rows,
    statusTprmId,
    pmCurrentTMO: pmCurrentTmo,
    skip: !isActiveKanban,
  });

  const { usersData } = useKanbanBoardUserData();

  const usersById = useMemo(() => {
    if (!usersData) return {};
    return usersData.reduce((acc, item) => {
      const key = `${item.firstName} ${item.lastName}`.trim().toLowerCase();
      acc[key ?? ''] = item;
      return acc;
    }, {} as Record<string, UserRepresentation>);
  }, [usersData]);

  const { onApplySelectedColor } = useColorRangeActions({
    severityId,
  });

  const {
    setContextMenuPosition,
    contextMenuPosition,

    onContextMenuItemClick,
    isOpenCreateGroupDialog,
    setIsOpenCreateGroupDialog,
    isOpenAddElementsGroupDialog,
    setIsOpenAddElementsGroupDialog,
    isOpenDeleteGroupDialog,
    setIsOpenDeleteGroupDialog,
    isShowHistoryOpen,
    setIsShowHistoryOpen,

    setIsOpenGroupCreateTemplate,
    isOpenGroupCreateTemplate,

    isOpenDeleteGroupTemplate,
    setIsOpenDeleteGroupTemplate,
  } = useProcessTableContextMenu({
    tableProcessData,
    pmSelectedRow: selectedRow,
    pmSelectedRows: selectedRows,
    refetchAfterSuccess,
    pmSelectedRowId,
    pmTmoId,
    viewType,
    setIsCompleteUserTaskOpen,
    userTasksSelectedRow,
    userTasksSelectedRows,
  });

  const { contextMenuConfig } = useContextMenuConfig({
    selectedGroup,
    viewType,
    selectedRows,
    hasSelectedRows: !!selectedRows?.length,
    isOpenMapActive,
    isOpenDashboardActive,
    permissions,
  });

  const {
    allProcessGroup,
    onCreateGroup,
    onAddElementsToGroup,
    onDeleteGroup,
    isLoadingAddElementsToGroup,
    isFetchingAllProcessGroup,
    isLoadingDeleteGroup,
    setNewOffset,
    totalGroups,
    isLoadingCreateGroup,

    onCreateGroupTemplate,
    isLoadingGroupTemplateCreation,
  } = useProcessGroups({
    selectedRows,
    selectedRow,
    refetchAfterSuccess,
    setIsOpenTemplateDialog: setIsOpenGroupCreateTemplate,
  });

  const { getChildRightSideElements, getFilterItemRightElement } = useLeftPanelSeverityData({
    severityData: severityQuantityDataWithLive || [],
    isErrorSeverityData: isLiveDataError || isFiltersSeverityCountError,
    isFetchingSeverityData: isFiltersSeverityCountFetching,
    severityId,
  });

  const {
    getProcessesAndGroupsData,
    closeProcessesAndDeleteGroups,
    processesCountWithoutEndDate,
    groupsCount,
    isFetchingProcesses,
  } = useCloseProcessesAndDeleteGroups({
    severityProcessesBody,
    tableTotalCount: tableProcessData?.totalCount,
  });

  useEffect(() => {
    setSelectedGroup(null);
  }, [selectedMultiFilter, setSelectedGroup]);

  // useEffect(() => {
  //   if ((selectedRows.length === 0 || selectedRows.length === 1) && selectedRow) {
  //     setIsRightPanelOpen(true);
  //   } else {
  //     setIsRightPanelOpen(false);
  //   }
  // }, [selectedRows, selectedRow]);

  const onRowClick = useCallback((rowData: GridRowParams) => {
    let objectId: number | null = null;

    if (isUserTask(rowData.row)) {
      if (rowData.row.variables) {
        const id = rowData.row.variables.find((variable) => variable.name === 'id')?.value;
        if (id) objectId = +id;
      }
    } else {
      objectId = +rowData.row.id;
    }

    if (!rowData?.row?.groupName) setIsRightPanelOpen(true);
    setPmSelectedRowId(objectId);
  }, []);

  const onTableRowDoubleClick = useCallback(() => {
    if (singleClickTimer) {
      clearTimeout(singleClickTimer);
      setSingleClickTimer(null);
    }
    const currentGroup = selectedRow?.groupName;
    if (currentGroup) setSelectedGroup(currentGroup);
  }, [selectedRow, singleClickTimer, setSelectedGroup]);

  const onConfirmDeleteProcessesClick = async () => {
    await closeProcessesAndDeleteGroups();
    refetchAfterSuccess();
    setIsConfirmDeleteModalOpen(false);
  };

  const onCloseAllCurrentProcessesClick = async () => {
    setIsConfirmDeleteModalOpen(true);
    await getProcessesAndGroupsData();
  };

  const getSelectedGroup = (): string[] => {
    const groupNamesFromSelectionsRows = selectedRows.flatMap((pmItem) =>
      pmItem.groupName ? pmItem.groupName : [],
    );

    return selectedGroup ? [selectedGroup] : groupNamesFromSelectionsRows;
  };

  const handlePageModeChange = (newMode: ProcessManagerPageMode) => {
    setViewType(newMode);
  };

  const onWarningProcessClick = useCallback((process: SeverityProcessModelData) => {
    setPmSelectedRowId(+process.id);
    setIsRightPanelOpen(true);
  }, []);

  const selectedRowsIds = useMemo(() => selectedRows.map((item) => +item.id), [selectedRows]);

  const selectedObjects: Record<string, string> = useMemo(
    () =>
      selectedRows.reduce((acc, item) => {
        acc[item.id] = item.name;
        return acc;
      }, {} as Record<string, string>),
    [selectedRows],
  );

  const kanbanBoardColorRangesData = useMemo(() => {
    if (!groupedColorRangesData || !pmCurrentTmo?.severity_id) return null;
    if (!groupedColorRangesData[pmCurrentTmo.severity_id]?.length) return null;
    const defaltColorRange = filterColorRanges(groupedColorRangesData[pmCurrentTmo.severity_id]);
    return defaltColorRange;
  }, [groupedColorRangesData, pmCurrentTmo?.severity_id]);

  const { columns, rows, totalRows } = useProcessTableData({
    colorRangesData,
    returnableParamTypes,
    severityProcessData: tableProcessData,
    customColumnDimensions: customColumnDimensions[pmTmoId!],
    viewType,
    pmCurrentTmo,
  });

  return (
    <ProcessManagerContainer>
      <SidebarLayout>
        <Sidebar openSize={350} collapsible>
          {activePage === 'processManager' && (
            <LeftPanel
              multiFilterData={{
                setFilterItemRightSlot: getFilterItemRightElement,
                refetchAfterSuccess,
              }}
              hierarchyData={{
                showHierarchyChildCount: false,
                parentData: {
                  parentItems: hierarchyData.hierarchyParentsData.parents,
                  isErrorParentsItems: hierarchyData.hierarchyParentsData.isErrorParents,
                  isLoadingParentsItems: hierarchyData.hierarchyParentsData.isLoadingParents,
                },
                childrenData: {
                  childrenItems: hierarchyData.hierarchyChildrenData.children,
                  isErrorChildrenItems: hierarchyData.hierarchyChildrenData.isErrorChildren,
                  isLoadingChildrenItems: hierarchyData.hierarchyChildrenData.isLoadingChildren,
                  errorMessageChildrenItems:
                    hierarchyData.hierarchyChildrenData.errorMessageChildrenItems,
                  getChildRightSideElements,
                },
              }}
              withLifecycle
              liveUpdateData={{
                setIsLiveUpdate,
                isLiveUpdate,
                isErrorLiveData: isLiveDataError || isFiltersSeverityCountError,
                isLoadingLiveData: isFiltersSeverityCountFetching,
              }}
              permissions={permissions}
              objectTypesAnchor="pm"
            />
          )}
        </Sidebar>
        <Container padding="20px">
          <MainView>
            {activePage === 'processManager' && (
              <Header
                liveSeverityByRangesData={severityCountWithLive}
                setSeverityBody={setSeverityBody}
                selectedGroup={selectedGroup}
                tableApiRef={apiRef}
                columnButtonsDisabled={!tableProcessData?.rows.length}
                tableProcessBody={severityProcessesBody}
                onCloseAllCurrentProcessesClick={onCloseAllCurrentProcessesClick}
                permissions={permissions}
                pmTmoId={pmTmoId}
                exportDataDelimiter={exportDataDelimiter}
                selectedRowsIds={selectedRowsIds}
                selectedTab={activePage}
                pageMode={viewType}
                handlePageModeChange={handlePageModeChange}
                isActiveKanban={isActiveKanban}
                setDefaultColumnsSettings={setDefaultColumnsSettings}
                onReload={refetchAll}
                isLoading={isTableProcessesDataFetching || isParamTypesFetching}
              />
            )}
            <MainViewBody>
              <TableWrapper
                sx={{
                  ...(isRightPanelOpen && { marginRight: '10px' }),
                  ...(viewType === 'list'
                    ? { width: '100%', minWidth: 0 }
                    : { opacity: 0, visibility: 'hidden', width: 0, height: 0 }),
                }}
              >
                <ErrorBoundary fallback="Error in process table">
                  <ProcessTable
                    apiRef={apiRef}
                    columns={columns}
                    isColumnGroups={viewType === 'list'}
                    rows={rows}
                    totalRows={totalRows}
                    tmoId={pmTmoId}
                    isLoading={isTableProcessesDataFetching || isParamTypesFetching}
                    onRowClick={onRowClick}
                    onRowDoubleClick={onTableRowDoubleClick}
                    contextMenuPosition={contextMenuPosition}
                    setContextMenuPosition={setContextMenuPosition}
                    contextMenuComponent={
                      <ContextMenuComponent
                        contextMenuConfig={contextMenuConfig}
                        onContextMenuItemClick={onContextMenuItemClick}
                        permissions={permissions}
                      />
                    }
                  />
                </ErrorBoundary>
                <Dialog
                  open={isOpenCreateGroupDialog}
                  PaperProps={{ sx: { maxWidth: 'none', minWidth: '700px' } }}
                  onClose={() => setIsOpenCreateGroupDialog(false)}
                >
                  <CreateGroup
                    isOpen
                    setIsOpen={setIsOpenCreateGroupDialog}
                    onCreate={onCreateGroup}
                    currentTmoId={pmTmoId}
                    isLoading={isLoadingCreateGroup}
                  />
                </Dialog>

                <Dialog
                  open={isOpenGroupCreateTemplate}
                  PaperProps={{ sx: { maxWidth: 'none', minWidth: '700px' } }}
                  onClose={() => setIsOpenGroupCreateTemplate(false)}
                >
                  <StepByStepCreationComponent
                    isLoading={isLoadingGroupTemplateCreation}
                    onTemplateCreate={onCreateGroupTemplate}
                    isOpen={isOpenGroupCreateTemplate}
                    setIsOpen={setIsOpenGroupCreateTemplate}
                  />
                </Dialog>

                <Dialog
                  open={isOpenDeleteGroupTemplate}
                  PaperProps={{ sx: { maxWidth: 'none', minWidth: '700px' } }}
                  onClose={() => setIsOpenDeleteGroupTemplate(false)}
                >
                  <DeleteGroupTemplate
                    isOpen={isOpenDeleteGroupTemplate}
                    setIsOpen={(isOpen) => setIsOpenDeleteGroupTemplate(isOpen)}
                  />
                </Dialog>

                <AddElementsToGroup
                  isOpen={isOpenAddElementsGroupDialog}
                  setIsOpen={setIsOpenAddElementsGroupDialog}
                  groupList={allProcessGroup}
                  isLoadingGroupList={isFetchingAllProcessGroup}
                  isLoadingAddElements={isLoadingAddElementsToGroup}
                  onAddClick={onAddElementsToGroup}
                  selectedElementsCount={selectedRows.length}
                  setNewOffset={setNewOffset}
                  totalGroups={totalGroups}
                />
                <DeleteGroup
                  isOpen={isOpenDeleteGroupDialog}
                  setIsOpen={setIsOpenDeleteGroupDialog}
                  groupList={allProcessGroup}
                  isLoadingGroupList={isFetchingAllProcessGroup}
                  isLoadingDeleteGroup={isLoadingDeleteGroup}
                  onDeleteClick={onDeleteGroup}
                  selectedGroup={getSelectedGroup()}
                />
              </TableWrapper>
              <TableWrapper
                sx={{
                  ...(isRightPanelOpen && { marginRight: '10px' }),
                  ...(viewType === 'tasks'
                    ? { width: '100%', minWidth: 0 }
                    : { opacity: 0, visibility: 'hidden', width: 0, height: 0 }),
                }}
              >
                <ErrorBoundary fallback="Error in user tasks table">
                  <UserTasksTable
                    isCompleteUserTaskOpen={isCompleteUserTaskOpen}
                    setIsCompleteUserTaskOpen={setIsCompleteUserTaskOpen}
                    usersById={usersById}
                    permissions={permissions}
                    pmCurrentTmo={pmCurrentTmo}
                    viewType={viewType}
                    onRowClick={onRowClick}
                    onRowDoubleClick={onTableRowDoubleClick}
                    contextMenuPosition={contextMenuPosition}
                    setContextMenuPosition={setContextMenuPosition}
                    contextMenuComponent={
                      <ContextMenuComponent
                        contextMenuConfig={contextMenuConfig}
                        onContextMenuItemClick={onContextMenuItemClick}
                        permissions={permissions}
                      />
                    }
                  />
                </ErrorBoundary>
              </TableWrapper>

              {viewType === 'grid' && (
                <ErrorBoundary fallback="Error occured in kanban board">
                  <KanbanBoard
                    kanbanStatuses={kanbanStatuses}
                    kanbanTasks={kanbanTasks}
                    setContextMenuPosition={setContextMenuPosition}
                    kanbanBoardColorRangesData={kanbanBoardColorRangesData}
                    permissions={permissions}
                    isLoading={isTableProcessesDataFetching || isParamTypesFetching}
                    kanbanErrorSlot={
                      isActiveKanban ? undefined : (
                        <NoStatus
                          currentTMO={pmCurrentTmo}
                          isLoading={isTableProcessesDataFetching}
                        />
                      )
                    }
                  />
                </ErrorBoundary>
              )}

              <RightSidePanel
                objectId={pmSelectedRowId}
                objectTypeId={pmTmoId}
                isOpen={isRightPanelOpen}
                setIsOpen={() => {
                  setIsRightPanelOpen(false);
                }}
                defaultColumnsSettings={defaultColumnsSettings}
                permissions={permissions}
              />
            </MainViewBody>
            <AssociatedObjectsWidget permissions={permissions} />
          </MainView>
        </Container>
      </SidebarLayout>
      {isOpenColorSelecting.processManager && (
        <ColorSelecting
          palettes={
            selectedColumnForColoring?.field
              ? groupedColorRangesData?.[selectedColumnForColoring.field]?.filter(
                  (range: { valType: string }) => selectedColumnForColoring.type === range.valType,
                )
              : []
          }
          tprms={
            selectedColumnForColoring
              ? {
                  name: selectedColumnForColoring.headerName,
                  id: Number(selectedColumnForColoring.field),
                  val_type: selectedColumnForColoring.type,
                }
              : undefined
          }
          handleApplyColors={onApplySelectedColor}
        />
      )}
      <ColorSettings isSeverity={severityId === Number(selectedColumnForColoring?.field)} />
      <ConfirmDeleteProcessesModal
        open={isConfirmDeleteModalOpen}
        handleModalClose={() => setIsConfirmDeleteModalOpen(false)}
        handleDeleteClick={() => onConfirmDeleteProcessesClick()}
        processesCountWithoutEndDate={processesCountWithoutEndDate}
        groupsCount={groupsCount}
        isFetchingProcesses={isFetchingProcesses}
        permissions={permissions}
      />
      {isShowHistoryOpen && activePage === 'processManager' && (
        <DraggableDialog
          open={isShowHistoryOpen && activePage === 'processManager'}
          onClose={() => setIsShowHistoryOpen(false)}
          title={
            <HistoryTableHeader
              permissions={permissions}
              tableApiRef={historyTableApiRef}
              defaultColumnsSettings={defaultColumnsSettings}
              setHistorySearchValue={setHistorySearchValue}
            />
          }
          minWidth={400}
          minHeight={400}
          width={800}
          height={600}
        >
          <HistoryTable
            apiRef={historyTableApiRef}
            historySearchValue={historySearchValue}
            isShowHistoryOpen={isShowHistoryOpen}
            pmTmoId={pmTmoId}
            selectedObjects={selectedObjects}
          />
        </DraggableDialog>
      )}
      {isObjectCRUDModalOpen && activePage === 'processManager' && (
        <CreateObjectComponent
          objectId={pmSelectedRowId}
          objectTypeId={pmTmoId ?? null}
          isOpen={isObjectCRUDModalOpen && activePage === 'processManager'}
        />
      )}
      {activePage === 'processManager' && (
        <ChangeObjectActivityStatusModal
          objIds={selectedRowsIds}
          pmSelectedRows={selectedRows}
          setIsRightPanelOpen={setIsRightPanelOpen}
        />
      )}
      {isLiveUpdate && warningRows.length > 0 && (
        <WarningObjectsList
          warningRows={warningRows}
          onWarningProcessClick={onWarningProcessClick}
        />
      )}
    </ProcessManagerContainer>
  );
};
export default ProcessManagerPage;
