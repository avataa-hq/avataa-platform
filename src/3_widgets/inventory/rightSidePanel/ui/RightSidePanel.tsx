import { useEffect, useRef, useState } from 'react';
import { Graph } from '@antv/g6';
import {
  Attributes,
  BottomControls,
  Comments,
  DEFAULT_DRAWER_MIN_WIDTH,
  ExportGraphFormat,
  exportGraphToImage,
  History,
  HistoryRightPanelCount,
  IFindPathData,
  INodeByMoIdKeys,
  IRoute,
  RightPanelHeaderActions,
  Trace,
  useDiagramsActions,
  usePanelWidthFromSettings,
  useRightPanelMaxWidth,
  useSwitchButtonsConfig,
} from '5_entites';
import {
  ActionTypes,
  CustomDrawer,
  IInventoryObjectModel,
  ITab,
  ITableColumnSettingsModel,
  useConfig,
  useParamsResolver,
  useTabs,
  useTranslate,
} from '6_shared';
import { useMapActions } from '3_widgets/inventory/mapWidget';
import ErrorBoundary from '5_entites/errorBoundary/ErrorBoundary';

interface IProps {
  isOpen: boolean;
  setIsOpen: () => void;
  objectId: number | null;
  objectTypeId?: number;

  defaultColumnsSettings?: ITableColumnSettingsModel | undefined;
  setSelectedTraceObject?: (object: IInventoryObjectModel | null) => void;
  traceRouteValue?: IRoute | null;
  setTraceRouteValue?: (value: IRoute | null) => void;
  setIsFindPathOpen?: (value: boolean) => void;
  isFindPathOpen?: boolean;
  findPathData?: IFindPathData | null;
  traceNodesByMoIdKeysValue?: INodeByMoIdKeys | null;
  setTraceNodesByMoIdKeysValue?: (value: INodeByMoIdKeys | null) => void;

  addTab?: (value: ITab) => void;

  permissions?: Record<ActionTypes, boolean>;
}

export const RightSidePanel = ({
  isOpen,
  setIsOpen,
  objectId,
  objectTypeId,

  defaultColumnsSettings,
  setSelectedTraceObject,
  traceRouteValue,
  setTraceRouteValue,
  setIsFindPathOpen,
  isFindPathOpen,
  findPathData,
  traceNodesByMoIdKeysValue,
  setTraceNodesByMoIdKeysValue,

  addTab,

  permissions,
}: IProps) => {
  const translate = useTranslate();
  const graphRef = useRef<Graph | null>(null);

  const [historyCount, setHistoryCount] = useState(0);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isTraceTableModalOpen, setIsTraceTableModalOpen] = useState(false);
  const [isTraceButtonsDisabled, setIsTraceButtonsDisabled] = useState(false);
  const [newObjectId, setNewObjectId] = useState<number | null>(null);
  const [rightPanelTitle, setRightPanelTitle] = useState<string>('Attributes');
  const [drawerWidth, setDrawerWidth] = useState(DEFAULT_DRAWER_MIN_WIDTH);

  const { selectedTab, activeTabs } = useTabs();

  const {
    userRoles,
    config: { _disable_timezone_adjustment: disableTimezoneAdjustment },
  } = useConfig();

  const permissionView = permissions?.view ?? true;

  const { setIsParamsResolverOpen, setUpdateParamsBody, setUpdateObjectBody, setParentIdOptions } =
    useParamsResolver();

  useEffect(() => {
    if (objectId) {
      setNewObjectId(objectId);
    }
  }, [objectId]);

  const handleDrawerWidth = (width: number) => {
    setDrawerWidth(width);
  };

  const { switchButtonsConfig } = useSwitchButtonsConfig({ permissions });
  const { externalMouseup } = usePanelWidthFromSettings({
    objectTypeId,
    drawerWidth,
    handleDrawerWidth,
  });
  const { drawerMaxWidth } = useRightPanelMaxWidth();

  const { setMapData, setSelectedObjectList, setTempCoordinates } = useMapActions();
  const { setSelectedDiagram, setGraphInitialData, setIsLoadingDiagram } = useDiagramsActions();

  const onSortHistoryClick = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const handleTraceTableModal = () => {
    setIsTraceTableModalOpen(!isTraceTableModalOpen);
  };

  const handleTraceButtonsDisabled = (value: boolean) => {
    setIsTraceButtonsDisabled(value);
  };

  const onExportTraceImageClick = (format: ExportGraphFormat) => {
    exportGraphToImage({ graphRef, format, exportedName: traceRouteValue?.route });
  };

  return (
    <CustomDrawer
      id="right-side-panel"
      open={isOpen}
      onClose={setIsOpen}
      drawerWidth={drawerWidth}
      setDrawerWidth={handleDrawerWidth}
      externalMouseup={externalMouseup}
      switchButtonsConfig={switchButtonsConfig}
      title={permissionView ? translate(rightPanelTitle as any) : undefined}
      onSwitchButtonsClick={(newTitle) => setRightPanelTitle(newTitle)}
      drawerMaxWidth={drawerMaxWidth}
      selectedTab={selectedTab}
      titleSlot={
        permissionView &&
        rightPanelTitle === 'History' && <HistoryRightPanelCount historyCount={historyCount} />
      }
      bottomControllsSlot={<BottomControls objectId={newObjectId} permissions={permissions} />}
      headerActions={
        permissionView && (
          <RightPanelHeaderActions
            isTraceButtonsDisabled={isTraceButtonsDisabled}
            rightPanelTitle={rightPanelTitle}
            selectedTab={selectedTab}
            handleTraceTableModal={handleTraceTableModal}
            onSortHistoryClick={onSortHistoryClick}
            sortDirection={sortDirection}
            onExportTraceImageClick={onExportTraceImageClick}
          />
        )
      }
    >
      <>
        {permissionView && rightPanelTitle === 'Attributes' && (
          <ErrorBoundary fallback="Right side panel error Attributes">
            <Attributes
              objectId={newObjectId}
              newDrawerWidth={drawerWidth}
              defaultColumnsSettings={defaultColumnsSettings}
              setParamsResolverOpen={setIsParamsResolverOpen}
              setParamsResolverUpdateBody={setUpdateParamsBody}
              setParamsResolverUpdateObjectBody={setUpdateObjectBody}
              setParamsResolverParentIdOptions={setParentIdOptions}
              permissions={permissions}
            />
          </ErrorBoundary>
        )}
        {permissionView && rightPanelTitle === 'History' && (
          <History
            objectId={newObjectId}
            objectTypeId={objectTypeId}
            historyCount={historyCount}
            setHistoryCount={setHistoryCount}
            newDrawerWidth={drawerWidth}
            sortDirection={sortDirection}
            disableTimezoneAdjustment={disableTimezoneAdjustment}
          />
        )}
        {permissionView && rightPanelTitle === 'Comments' && (
          <Comments
            objectId={newObjectId}
            newDrawerWidth={drawerWidth}
            isDrawerOpen={isOpen}
            userRoles={userRoles}
            permissions={permissions}
          />
        )}
        {permissionView && rightPanelTitle === 'Trace' && (
          <Trace
            objectId={newObjectId}
            permissions={permissions}
            isTraceTableModalOpen={isTraceTableModalOpen}
            handleTraceTableModal={handleTraceTableModal}
            graphRef={graphRef}
            setIsTraceButtonsDisabled={handleTraceButtonsDisabled}
            setSelectedTraceObject={setSelectedTraceObject}
            isRightPanelOpen={isOpen}
            traceRouteValue={traceRouteValue}
            setTraceRouteValue={setTraceRouteValue}
            setIsFindPathOpen={setIsFindPathOpen}
            isFindPathOpen={isFindPathOpen}
            findPathData={findPathData}
            traceNodesByMoIdKeysValue={traceNodesByMoIdKeysValue}
            setTraceNodesByMoIdKeysValue={setTraceNodesByMoIdKeysValue}
            selectedTab={selectedTab}
            activeTabs={activeTabs}
            setMapData={setMapData}
            setSelectedObjectList={setSelectedObjectList}
            setTempCoordinates={setTempCoordinates}
            addTab={addTab}
            setSelectedDiagram={setSelectedDiagram}
            setGraphInitialData={setGraphInitialData}
            setIsLoadingDiagram={setIsLoadingDiagram}
          />
        )}
      </>
    </CustomDrawer>
  );
};
