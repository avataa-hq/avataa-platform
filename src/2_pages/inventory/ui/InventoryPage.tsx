import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  GridRowParams,
  gridVisibleColumnFieldsSelector,
  useGridApiRef,
} from '@mui/x-data-grid-premium';

import {
  InventoryTable,
  useGetRows,
  useGetColumns,
  useInventoryResponses,
  useGetTmoId,
  TableErrorModal,
  useGetObjectsRequestBody,
  HistoryTableHeader,
  HistoryTable,
  useGetInventoryObjectData,
  useExportObjects,
  FindPath,
  EditMultipleParams,
  ShowCommonPath,
  CreateObjectComponent,
  MultipleEditTitle,
  useInventoryTableHandleActions,
  ParamVersionsResolver,
  useRightPanelAutoOpen,
  IFindPathData,
  useTrace,
} from '5_entites';
import {
  SidebarLayout,
  useTranslate,
  DraggableDialog,
  useGetPermissions,
  IInventoryFilterModel,
  IGetObjectsByFiltersModel,
  ObjectByFilters,
  CompositeSortingItem,
  ITableColumnSettingsModel,
  useAppNavigate,
  useObjectCRUD,
  useParamsResolver,
  useHierarchy,
  useInventory,
  defaultColumnVisibilityModel,
  INVENTORY_ATTRIBUTE_LIST,
  useInventoryTable,
  DataTransferFileExtension,
  useAssociatedObjects,
  useTabs,
  useBatchImport,
  useLeftPanelWidget,
} from '6_shared';
import ErrorBoundary from '5_entites/errorBoundary/ErrorBoundary';
import {
  CustomTableToolbar,
  useGetSettingsIndicator,
  ImportObjectsToInventoryWidget,
  LeftPanel,
  RightSidePanel,
  AssociatedObjectsWidget,
} from '3_widgets';
import { ChangeObjectActivityStatusModal } from '5_entites/inventory/ui/table/changeObjectActivityStatusModal/ChangeObjectActivityStatusModal';
import { FileViewerModal } from '5_entites/inventory/ui/table/fileViewer/FileViewerModal';
import { useHierarchyData } from '3_widgets/inventory/leftPanel/lib';
import { useGetHasFilesColumn } from '5_entites/inventory/lib/table/hooks/useGetHasFileColumn';
import { useFileUpload, useContextMenu } from '../lib';
import { InventoryPageContainer, TableBody, TableWrapper } from './InventoryPage.styled';
import { useCurrentObjectInfo } from '../lib/hooks/useCurrentObjectInfo';

const InventoryPage = () => {
  const translate = useTranslate();
  const navigate = useAppNavigate();

  const {
    tmoId,
    isFileDownloadModalOpen,
    isHistoryModalOpen,
    setIsFileDownloadModalOpen,
    setIsHistoryModalOpen,
  } = useInventory();

  const {
    selectedRows,
    rightClickedRowId,
    visibleColumns,
    isCustomFiltersSetActive,
    isCustomColumnsSetActive,
    pagination,
    sorting,
    searchValue,
    customColumnsOrder,
    exportDataDelimiter,
    isParentsData,
    selectedFilter,
    columnDimensions,
    isDefaultSettingsBlocked,
    isCheckboxSelection,

    setExportDataDelimiter,
    setIsParentsData,
    setSearchValue,
  } = useInventoryTable();

  const { isObjectsActive, objectCRUDComponentUi, setIsObjectCRUDModalOpen, setIsObjectsActive } =
    useObjectCRUD();
  const { isObjectCRUDModalOpen } = objectCRUDComponentUi;

  const {
    isParamsResolverOpen,

    setIsParamsResolverOpen,
    setUpdateParamsBody,
    setUpdateObjectBody,
    setParentIdOptions,
  } = useParamsResolver();

  const permissions = useGetPermissions('inventory');

  useGetTmoId();
  // useGetObjIdsArray();

  const { Sidebar, Container } = SidebarLayout;

  const { isOpenAssociatedTableModal, detailedView } = useAssociatedObjects();

  const {
    selectedTmo: associatedTmo,
    rightClickedRowId: associatedObjId,
    selectedRows: associatedSelectedRows,
  } = detailedView;

  const {
    importedFileColumnNames,
    importedFileRows,
    importDataDelimiter,
    setColumnNameMapping,
    setImportedFileColumnNames,
    setImportedFileRows,
  } = useBatchImport();

  const {
    activeHierarchy,
    hierarchyFilter,

    setIsImportDisabled,
    setSelectedIHierarchyItem,
    setSelectedParentId,
  } = useHierarchy();

  useEffect(() => {
    setSelectedIHierarchyItem(null);
    setSelectedParentId('root');
  }, [activeHierarchy]);

  const { selectedTab } = useTabs();
  const { selectedTabs } = useLeftPanelWidget();

  const {
    handleSetColumnDimensions,
    handleSetColumnsOrder,
    handleSetSorting,
    handleSetColumnsVisibility,
    handleSetIsActiveCustomColumnsSet,
    handleSetPinnedColumns,
    handleSetIsDefaultSettingsBlocked,
    handleSetSelectedRows,
    handleSetIsCheckboxSelection,
  } = useInventoryTableHandleActions();

  const setCustomSorting = (value: CompositeSortingItem) => {
    const validSorting = value.sorting.filter(
      (item) => !Number.isNaN(+item.field) || INVENTORY_ATTRIBUTE_LIST.includes(item.field),
    );
    const newValue = { ...value, sorting: validSorting };

    handleSetSorting(newValue);
  };

  const apiRef = useGridApiRef();

  const { objectsByFiltersBody, getExportBody } = useGetObjectsRequestBody({
    tmoId,
    pagination,
    sorting,
    searchValue,
    isObjectsActive,
    selectedFilter,
    delimiter: exportDataDelimiter,
    withParentsData: isParentsData,
    selectedRows,
  });

  const {
    columnsData: { inventoryColumns, isInventoryColumnsFirstLoading, isInventoryColumnsLoading },
    rowsData: { inventoryRows, inventoryRowsLoading, refetchInventoryRows },
    currentObjType: { currentTmoData, currentTmoLoading },
    parentColumnsData: { inventoryParentColumns },
    parentRowsData: { inventoryParentRows },
  } = useInventoryResponses({
    objectsByFiltersBody,
  });

  const currentInventoryMultiFilter = useMemo<IInventoryFilterModel[] | undefined>(() => {
    if (!objectsByFiltersBody && !hierarchyFilter) return undefined;

    const hierarchyCorrectFilter: IInventoryFilterModel[] | undefined =
      hierarchyFilter?.filters?.map((filter) => ({
        filters: filter.filters,
        rule: filter.logicalOperator,
        columnName: filter.column.id,
      }));

    const objectsByFilterCorrectFilters = objectsByFiltersBody?.filter_columns as
      | IInventoryFilterModel[]
      | undefined;

    return [...(objectsByFilterCorrectFilters ?? []), ...(hierarchyCorrectFilter ?? [])];
  }, [objectsByFiltersBody, hierarchyFilter]);

  const { hierarchyChildrenData, hierarchyParentsData, inventoryObjectsData } = useHierarchyData({
    filters: currentInventoryMultiFilter,
    additionalSkip: selectedTabs[selectedTab] !== 'topology' || selectedTab !== 'inventory',
    sort: objectsByFiltersBody?.sort_by,
    offset: objectsByFiltersBody?.offset,
    limit: objectsByFiltersBody?.limit,
    disabledAggregation: true,
    removeActiveFilter: true,
  });

  const actuallyRowsData = useMemo<IGetObjectsByFiltersModel | undefined>(() => {
    if (selectedTabs[selectedTab] === 'topology') {
      return {
        objects: inventoryObjectsData.inventoryObjects as ObjectByFilters[],
        total_hits: inventoryObjectsData.totalCount,
      };
    }
    return inventoryRows;
  }, [
    inventoryObjectsData.inventoryObjects,
    inventoryObjectsData.totalCount,
    inventoryRows,
    selectedTab,
    selectedTabs,
  ]);

  const rowsLoading = inventoryRowsLoading || inventoryObjectsData.isLoadingInventoryObjects;

  const columns = useGetColumns({
    colsData: inventoryColumns,
    tmoId,
    visibleColumns,
    customColumnsOrder: customColumnsOrder[tmoId as number],
    parentColsData: inventoryParentColumns,
    isParentsData,
    columnDimensions,
  });

  const rows = useGetRows({
    rowsData: actuallyRowsData?.objects,
    rowsParentData: inventoryParentRows,
  });

  const allRowIds = useMemo(() => rows.map((row) => row.id), [rows]);

  const hasFilesColumn = useGetHasFilesColumn({
    isCheckboxSelection,
    setColumnsVisibility: handleSetColumnsVisibility,
    tmoId,
    visibleColumns,
    allRowIds,
    setSelectedRows: handleSetSelectedRows,
    setIsCheckboxSelection: handleSetIsCheckboxSelection,
  });

  const totalColumns = [hasFilesColumn, ...columns];

  const onObjectActivitySwitch = (value: boolean) => {
    setIsObjectsActive(value);
  };

  const [isImportModelOpen, setIsImportModelOpen] = useState<boolean>(false);
  const [objectId, setObjectId] = useState<number | null>(null);
  const [isErrorWindowOpen, setIsErrorWindowOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [selectedObjectParentID, setSelectedObjectParentID] = useState<number | null>(null);
  const [isMultipleEditOpen, setIsMultipleEditOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [isShowCommonPathOpen, setIsShowCommonPathOpen] = useState(false);
  const [isFindPathOpen, setIsFindPathOpen] = useState(false);
  const [defaultColumnsSettings, setDefaultColumnsSettings] = useState<
    ITableColumnSettingsModel | undefined
  >();
  const [findPathData, setFindPathData] = useState<IFindPathData | null>(null);

  const {
    traceRouteValue,
    setTraceRouteValue,
    traceNodesByMoIdKeysValue,
    setTraceNodesByMoIdKeysValue,
  } = useTrace();

  // Import Tprms
  const inputFileDownload = useRef<HTMLInputElement | null>(null);

  const rightPanelAutoOpen = useMemo(
    () =>
      (!currentTmoLoading &&
        !rowsLoading &&
        !isInventoryColumnsLoading &&
        actuallyRowsData &&
        actuallyRowsData.total_hits === 1 &&
        selectedTabs.inventory === 'topology') ||
      false,
    [
      actuallyRowsData,
      currentTmoLoading,
      isInventoryColumnsLoading,
      rowsLoading,
      selectedTabs.inventory,
    ],
  );

  useRightPanelAutoOpen({
    rightPanelAutoOpen,
    inventoryRows:
      rightPanelAutoOpen && actuallyRowsData?.total_hits === 1 ? actuallyRowsData : undefined,
    setNewObjectId: setObjectId,
    setIsRightPanelOpen,
  });

  useEffect(() => {
    setIsImportDisabled(!inventoryColumns?.length || isInventoryColumnsLoading);
  }, [inventoryColumns, isInventoryColumnsLoading]);

  useEffect(() => {
    if (isFileDownloadModalOpen) {
      inputFileDownload.current?.click();
      setIsFileDownloadModalOpen(false);
    }
  }, [isFileDownloadModalOpen]);

  const { handleFileUpload, isFileLoadError } = useFileUpload();

  useEffect(() => {
    if (isFileLoadError) {
      setIsErrorWindowOpen(true);
      setErrorMessage(translate('Invalid file input. Select Excel or CSV file.'));
    }
  }, [isFileLoadError, translate]);

  useEffect(() => {
    if (importedFileColumnNames.length && selectedTab === 'inventory') {
      setIsImportModelOpen(true);
    }
  }, [importedFileColumnNames, selectedTab]);

  useEffect(() => {
    setIsImportModelOpen(false);
    setImportedFileColumnNames([]);
    setImportedFileRows([]);
    setColumnNameMapping({});
  }, [selectedTab]);

  const { inventoryObjectData } = useGetInventoryObjectData({
    objectId: rightClickedRowId,
  });

  const { handleContextMenuItemClick } = useContextMenu({
    tmoId,
    inventoryObjectData: inventoryObjectData!,
    setIsMultipleEditOpen,
    setIsShowCommonPathOpen,
    setIsFindPathOpen,
  });

  // Add object
  const onAddObjectModalOpen = () => {
    if (tmoId) {
      setIsObjectCRUDModalOpen(true);
    }
  };

  // Export table data
  const { exportData, isExportLoading } = useExportObjects();

  const loadFile = useCallback(
    (fileType: DataTransferFileExtension) => {
      if (tmoId) {
        const params = gridVisibleColumnFieldsSelector(apiRef);
        exportData(getExportBody(params, fileType));
      }
    },
    [apiRef, exportData, getExportBody, tmoId],
  );

  // Custom settings indicators

  const { getFiltersIndicator, getColumnsIndicator } = useGetSettingsIndicator({
    filterSettings: selectedFilter[tmoId as number],
    columnSettings: visibleColumns[tmoId as number],
    defaultColumnsSettings: defaultColumnVisibilityModel,
  });

  const onSearchClick = (value: string) => {
    if (!tmoId) return;
    setSearchValue({ searchValue: value, tmoId });
  };

  const onCancelClick = () => {
    if (!tmoId) return;
    setSearchValue({ searchValue: '', tmoId });
  };

  useEffect(() => {
    if (actuallyRowsData && selectedRows.length === 1 && selectedRows[0] === objectId) {
      const currentObject = actuallyRowsData.objects.find((obj) => obj.id === objectId);
      if (currentObject) {
        setSelectedObjectParentID(currentObject.p_id);
      }
    }
    if (selectedRows.length === 0) setSelectedObjectParentID(null);
  }, [actuallyRowsData, objectId, selectedRows]);

  useEffect(() => {
    setIsHistoryModalOpen(selectedTab !== 'inventory');
  }, [selectedTab]);

  const onTableRowClick = useCallback((row: GridRowParams) => {
    if (row.id) {
      setObjectId(+row.id);
      setTraceRouteValue(null);
      setFindPathData(null);
      setIsRightPanelOpen(true);
    }
  }, []);

  const [historySearchValue, setHistorySearchValue] = useState<string>('');
  const historyTableApiRef = useGridApiRef();

  const onParentsDataSwitch = (value: boolean) => setIsParentsData(value);

  // Set current object
  const { currentObjectId, currentObjectTmo, currentSelectedObjects } = useCurrentObjectInfo({
    isOpenAssociatedTableModal,
    mainTableTmo: tmoId,
    associatedTableTmo: associatedTmo,
    mainTableRightClickedObjectId: rightClickedRowId,
    associatedTableRightClickedObjectId: associatedObjId,
    mainTableSelectedObjects: selectedRows,
    associatedTableSelectedObjects: associatedSelectedRows,
  });

  const onParamsResolverClose = () => {
    setUpdateParamsBody(null);
    setUpdateObjectBody(null);
    setParentIdOptions(null);
    setIsParamsResolverOpen(false);
  };

  const selectedObjects = useMemo(
    () =>
      selectedRows.reduce((acc, item) => {
        const currentObject = actuallyRowsData?.objects.find((obj) => obj.id === item);
        if (currentObject) {
          acc[item] = currentObject.name;
          return acc;
        }
        return acc;
      }, {} as Record<string, string>),
    [actuallyRowsData?.objects, selectedRows],
  );

  return (
    <InventoryPageContainer>
      <SidebarLayout>
        <input
          ref={inputFileDownload}
          className="hidden-input"
          type="file"
          value=""
          onChange={(e) => {
            // saveFile(e.target!.files![0], STORED_INVENTORY_IMPORT_FILE_NAME);
            handleFileUpload(e);
          }}
        />
        <Sidebar openSize={350} collapsible>
          {selectedTab === 'inventory' && (
            <LeftPanel
              isObjectTypeFirstSelected
              objectTypesAnchor="inventory"
              permissions={permissions}
              hierarchyData={{
                showHierarchyChildCount: true,
                parentData: {
                  parentItems: hierarchyParentsData.parents,
                  isErrorParentsItems: hierarchyParentsData.isErrorParents,
                  isLoadingParentsItems: hierarchyParentsData.isLoadingParents,
                },
                childrenData: {
                  childrenItems: hierarchyChildrenData.children,
                  isErrorChildrenItems: hierarchyChildrenData.isErrorChildren,
                  isLoadingChildrenItems: hierarchyChildrenData.isLoadingChildren,
                },
              }}
            />
          )}
        </Sidebar>
        <Container padding="20px" position="relative">
          {selectedTab === 'inventory' && (
            <ErrorBoundary fallback="An error has occurred in the inventory page CustomTableToolbar">
              <CustomTableToolbar
                title={currentTmoData ? currentTmoData.name : 'Loading...'}
                apiRef={apiRef}
                isExportLoading={isExportLoading}
                loadExportFile={loadFile}
                onAdding={onAddObjectModalOpen}
                isObjectsActive={isObjectsActive}
                onObjectActivitySwitch={onObjectActivitySwitch}
                tmoId={tmoId as number}
                displayFilterIndicator={getFiltersIndicator()}
                displayColumnsIndicator={getColumnsIndicator()}
                displayCustomFilterIndicator={
                  isCustomFiltersSetActive[tmoId as number] ? 'block' : 'none'
                }
                displayCustomColumnIndicator={
                  isCustomColumnsSetActive[tmoId as number] ? 'block' : 'none'
                }
                hasCustomFiltersSettingComponent
                hasCustomColumnsSettingComponent
                hasAddObjectComponent
                hasSearchComponent
                hasFilterPanel
                hasColumnsPanel
                hasExportComponent
                hasShowParentsData
                setDelimiter={(value: string) => setExportDataDelimiter(value)}
                hasObjectActivitySwitch
                onSearchClick={(value) => onSearchClick(value)}
                onCancelClick={onCancelClick}
                permissions={permissions}
                isParentsDataShown={isParentsData}
                onParentsDataSwitch={onParentsDataSwitch}
                setCustomColumnDimensions={handleSetColumnDimensions}
                setCustomColumnsOrder={handleSetColumnsOrder}
                setCustomSorting={setCustomSorting}
                setCustomVisibleColumns={handleSetColumnsVisibility}
                setCustomPinnedColumns={handleSetPinnedColumns}
                setIsCustomColumnsSetActive={handleSetIsActiveCustomColumnsSet}
                isCustomColumnsSetActive={isCustomColumnsSetActive}
                setIsDefaultSettingsBlocked={handleSetIsDefaultSettingsBlocked}
                isDefaultSettingsBlocked={isDefaultSettingsBlocked}
                refetchData={refetchInventoryRows}
                setDefaultColumnsSettings={setDefaultColumnsSettings}
                selectedTab={selectedTab}
              />
            </ErrorBoundary>
          )}

          <TableBody sx={isRightPanelOpen ? { gap: '10px' } : undefined}>
            <ErrorBoundary fallback="An error has occurred in the inventory page table">
              <TableWrapper>
                <InventoryTable
                  columns={totalColumns}
                  rows={rows}
                  apiRef={apiRef}
                  tmoId={tmoId}
                  rowCount={actuallyRowsData ? actuallyRowsData.total_hits : 0}
                  isLoading={rowsLoading || isInventoryColumnsFirstLoading || currentTmoLoading}
                  onMenuItemClick={handleContextMenuItemClick}
                  onRowClick={onTableRowClick}
                  permissions={permissions}
                />
              </TableWrapper>
            </ErrorBoundary>

            {isRightPanelOpen && (
              <ErrorBoundary fallback="Right side panel error">
                <RightSidePanel
                  objectId={objectId}
                  objectTypeId={tmoId}
                  isOpen={isRightPanelOpen}
                  setIsOpen={() => {
                    setTraceRouteValue(null);
                    setFindPathData(null);
                    setIsRightPanelOpen(false);
                  }}
                  defaultColumnsSettings={defaultColumnsSettings}
                  traceRouteValue={traceRouteValue}
                  setTraceRouteValue={setTraceRouteValue}
                  setIsFindPathOpen={setIsFindPathOpen}
                  isFindPathOpen={isFindPathOpen}
                  findPathData={findPathData}
                  traceNodesByMoIdKeysValue={traceNodesByMoIdKeysValue}
                  setTraceNodesByMoIdKeysValue={setTraceNodesByMoIdKeysValue}
                  addTab={(value) => navigate(value.value)}
                  permissions={permissions}
                />
              </ErrorBoundary>
            )}
          </TableBody>
        </Container>
        <ImportObjectsToInventoryWidget
          objectTypeId={tmoId as number}
          paramTypeNames={importedFileColumnNames}
          isOpen={isImportModelOpen}
          onClose={() => setIsImportModelOpen(false)}
          filePreviewRows={importedFileRows}
          delimiter={importDataDelimiter}
        />
        <TableErrorModal
          isOpen={isErrorWindowOpen}
          onClose={() => setIsErrorWindowOpen(false)}
          message={errorMessage}
        />

        {isObjectCRUDModalOpen && selectedTab === 'inventory' && (
          <CreateObjectComponent
            objectId={rightClickedRowId}
            // objectId={objectCRUDComponentMode === 'editing' ? rightClickedRowId : null}
            objectTypeId={tmoId ?? null}
            isOpen={isObjectCRUDModalOpen && selectedTab === 'inventory'}
            selectedObjectParentID={selectedObjectParentID}
          />
        )}

        <AssociatedObjectsWidget permissions={permissions} setIsFindPathOpen={setIsFindPathOpen} />
        <ChangeObjectActivityStatusModal
          objIds={selectedRows as number[]}
          objectsData={actuallyRowsData?.objects}
          setIsRightPanelOpen={setIsRightPanelOpen}
        />
        <FileViewerModal objId={associatedObjId || rightClickedRowId!} permissions={permissions} />

        <DraggableDialog
          open={isHistoryModalOpen && selectedTab === 'inventory'}
          onClose={() => setIsHistoryModalOpen(false)}
          title={
            <HistoryTableHeader
              tableApiRef={historyTableApiRef}
              setHistorySearchValue={setHistorySearchValue}
              defaultColumnsSettings={defaultColumnsSettings}
              permissions={permissions}
            />
          }
          minWidth={420}
          minHeight={400}
          width={800}
          height={600}
        >
          <HistoryTable
            apiRef={historyTableApiRef}
            historySearchValue={historySearchValue}
            isShowHistoryOpen={isHistoryModalOpen}
            pmTmoId={tmoId}
            selectedObjects={selectedObjects}
          />
        </DraggableDialog>
        {isFindPathOpen && selectedTab === 'inventory' && (
          <DraggableDialog
            open={isFindPathOpen && selectedTab === 'inventory'}
            onClose={() => setIsFindPathOpen(false)}
            title={translate('Find a path')}
            minWidth={500}
            minHeight={400}
            width={600}
            height={400}
          >
            <FindPath
              objectId={rightClickedRowId}
              setIsRightPanelOpen={setIsRightPanelOpen}
              setTraceRouteValue={setTraceRouteValue}
              setTraceNodesByMoIdKeysValue={setTraceNodesByMoIdKeysValue}
            />
          </DraggableDialog>
        )}

        {isShowCommonPathOpen && selectedTab === 'inventory' && (
          <DraggableDialog
            open={isShowCommonPathOpen && selectedTab === 'inventory'}
            onClose={() => setIsShowCommonPathOpen(false)}
            title={translate('Show common path')}
            minWidth={400}
            minHeight={400}
            width={600}
            height={400}
          >
            <ShowCommonPath
              objectIds={currentSelectedObjects}
              setIsRightPanelOpen={setIsRightPanelOpen}
              setTraceRouteValue={setTraceRouteValue}
              setFindPathData={setFindPathData}
              setTraceNodesByMoIdKeysValue={setTraceNodesByMoIdKeysValue}
            />
          </DraggableDialog>
        )}

        <DraggableDialog
          open={isMultipleEditOpen && selectedTab === 'inventory'}
          onClose={() => setIsMultipleEditOpen(false)}
          title={<MultipleEditTitle objectsCount={currentSelectedObjects.length} />}
          minWidth={400}
          minHeight={400}
          width={800}
          height={400}
          draggable={false}
        >
          <EditMultipleParams
            tmoId={tmoId}
            selectedObjectIds={currentSelectedObjects}
            onClose={() => setIsMultipleEditOpen(false)}
            objectsByFilters={actuallyRowsData?.objects}
          />
        </DraggableDialog>

        <DraggableDialog
          open={isParamsResolverOpen}
          onClose={onParamsResolverClose}
          title="Parameters versions resolver"
          minWidth={400}
          minHeight={400}
          width={800}
          height={500}
          draggable={false}
          dialogContentSx={{ overflow: 'hidden' }}
        >
          <ParamVersionsResolver />
        </DraggableDialog>
      </SidebarLayout>
    </InventoryPageContainer>
  );
};

export default InventoryPage;
