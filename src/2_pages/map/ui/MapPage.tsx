import { useEffect, useMemo, useState } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import {
  LeftPanel,
  RightSidePanel,
  useGetObjectsData,
  ColorSelecting,
  ColorSettings,
} from '3_widgets';
import {
  FindPath,
  Legend,
  CreateObjectComponent,
  DeleteObjectModal,
  IFindPathData,
  useTrace,
} from '5_entites';
import {
  InventoryObjectTypesModel,
  SidebarLayout,
  IInventorySearchObjectModel,
  useGetPermissions,
  DraggableDialog,
  useTranslate,
  IColorRangeModel,
  IInventoryFilterModel,
  IInventoryObjectModel,
  useAppNavigate,
  useObjectCRUD,
  useHierarchy,
  useTabs,
  useColorsConfigure,
  useLeftPanelWidget,
  useInventoryMapWidget,
  IInventoryBoundsModel,
} from '6_shared';
import { MapPageStyled } from './MapPage.styled';
import { MainContainer } from './mainContainer/MainContainer';
import {
  useColorRanges,
  useLegendConfig,
  useMapData,
  useObjectTypeCheckboxData,
  useTopologyData,
} from '../lib';
import { useHierarchyData } from '../../../3_widgets/inventory/leftPanel/lib';

const { Sidebar, Container } = SidebarLayout;
const MapPage = () => {
  const translate = useTranslate();

  const navigate = useAppNavigate();

  const [isOpenLegend, setIsOpenLegend] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedObjectParentID, setSelectedObjectParentID] = useState<number | null>(null);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [isFindPathOpen, setIsFindPathOpen] = useState(false);
  const [selectedTraceObject, setSelectedTraceObject] = useState<IInventoryObjectModel | null>(
    null,
  );
  const [findPathData, setFindPathData] = useState<IFindPathData | null>(null);

  const permissions = useGetPermissions('map');

  const {
    objectCRUDComponentUi: { isObjectCRUDModalOpen },
  } = useObjectCRUD();

  const { currentTmoId, isOpenColorSelecting } = useColorsConfigure();

  const [objectsByObjectTypeData, setObjectsByObjectTypeData] = useState<
    IInventorySearchObjectModel[]
  >([]);
  const [outerMapBounds, setOuterMapBounds] = useState<IInventoryBoundsModel | null>(null);

  const {
    traceRouteValue,
    setTraceRouteValue,
    traceNodesByMoIdKeysValue,
    setTraceNodesByMoIdKeysValue,
  } = useTrace();

  const { selectedTab } = useTabs();

  const { selectedObject, mapData, selectedMap, requestedObjectIds, setIsMapLegendOpen } =
    useInventoryMapWidget();

  const {
    objectTypeCustomizationParams,
    selectedObjectTypesIds,
    legendCustomizationParams,
    selectedTabs,
    setObjectTypeCustomizationParams,
    setLegendCustomizationParams,
  } = useLeftPanelWidget();

  const { hierarchyFilter, selectedHierarchyItem, selectNestedTMO } = useHierarchy();

  const { colorRangesData, colorRanges, tprmColorData, selectColorRange } = useColorRanges({
    objectTypeCustomizationParams,
  });

  const handleFullscreen = useFullScreenHandle();

  const currentInventoryMultiFilter = useMemo<IInventoryFilterModel[] | undefined>(() => {
    const hierarchyCorrectFilter: IInventoryFilterModel[] | undefined =
      hierarchyFilter?.filters?.map((filter) => ({
        filters: filter.filters,
        rule: filter.logicalOperator,
        columnName: filter.column.id,
      }));

    return hierarchyCorrectFilter;
  }, [hierarchyFilter]);

  const { hierarchyChildrenData, hierarchyParentsData, inventoryObjectsData } = useHierarchyData({
    filters: currentInventoryMultiFilter,
    additionalSkip: selectedTabs[selectedTab] !== 'topology',
    removeActiveFilter: true,
    disabledAggregation: true,
  });

  const { hierarchyInventoryObjects, loadingMarker } = useTopologyData({
    objectTypeCustomizationParams,
    anotherObjectsIds: requestedObjectIds,
    objectsFromHierarchy: inventoryObjectsData.inventoryObjects,
    additionalSkip: selectedTabs[selectedTab] !== 'topology',
    childrenDataAdditionalSkip: !selectedHierarchyItem,
  });

  const { getObjectTypeCheckbox, objectTypesData } = useObjectTypeCheckboxData({
    setObjectsByObjectTypeData,
    objectTypeCustomizationParams,
    setObjectTypeCustomizationParams,
    selectedObjectTypesIds,
    selectNestedTMO,
  });

  const { legendData, onObjectTypeCheckBoxClick, onParamTypeCheckBoxClick } = useLegendConfig({
    objectTypeCustomizationParams,
    legendCustomizationParams,
    selectedObjectTypeIds: selectedObjectTypesIds,
    colorRangesData: colorRanges,
    colorData: tprmColorData,
    setLegendCustomizationParams,
  });

  const { isLoading, refetchObjectByCoords } = useGetObjectsData({
    outerMapBounds,
    setObjectsByObjectTypeData,
    tmoIds: selectedObjectTypesIds,
    additionalSkip: selectedTabs[selectedTab] === 'topology',
  });

  useEffect(() => {
    if (selectedTabs[selectedTab] === 'topology') {
      setObjectsByObjectTypeData([]);
    }
  }, [selectedTab, selectedTabs]);

  const { dataWithAdditionalParams } = useMapData({
    additionalParams: legendCustomizationParams,
    objectTypesData: objectsByObjectTypeData,
    generalMapData: mapData,
    hierarchyData: hierarchyInventoryObjects,
    tprmColorData,
  });

  const filteredDataWithAdditionalParams = useMemo(() => {
    if (loadingMarker) {
      return dataWithAdditionalParams.filter((data) => data.id !== loadingMarker.object.id);
    }
    return dataWithAdditionalParams;
  }, [dataWithAdditionalParams, loadingMarker]);

  const getChildLeftSideElements = (objectType: InventoryObjectTypesModel) => {
    return getObjectTypeCheckbox(objectType);
  };

  const handleLegendButton = () => {
    setIsOpenLegend(!isOpenLegend);
    setIsMapLegendOpen(!isOpenLegend);
  };

  useEffect(() => {
    if (selectedTab !== 'map') {
      handleFullscreen.exit();
    }
  }, [handleFullscreen, selectedTab]);

  const colorSelectingPalettes = useMemo<IColorRangeModel[]>(() => {
    if (!colorRangesData) return [];
    return colorRangesData.filter((palette) => {
      const paletteTmoId = parseInt(palette.tmoId, 10);
      const currentTmoPalette = currentTmoId[selectedTab];
      if (!currentTmoPalette) return null;
      return !Number.isNaN(paletteTmoId) ? paletteTmoId === currentTmoId[selectedTab] : null;
    });
  }, [colorRangesData, currentTmoId, selectedTab]);

  const selectPaletteId = useMemo(() => {
    if (!currentTmoId[selectedTab]) return 0;
    return (
      legendData?.find((d) => d.id === currentTmoId[selectedTab].toString())?.coloredTprms?.id ?? 0
    );
  }, [currentTmoId, legendData, selectedTab]);

  const { active: isActiveFs } = handleFullscreen;

  return (
    <MapPageStyled>
      <SidebarLayout>
        <Sidebar collapsible openSize={350}>
          <LeftPanel
            objectTypesData={{ getChildLeftSideElements }}
            objectTypesAnchor="map"
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
        </Sidebar>
        <Container sx={{ position: 'relative' }}>
          <FullScreen handle={handleFullscreen}>
            <MainContainer
              handleFullscreen={handleFullscreen}
              mapWidgetProps={{
                mapData: filteredDataWithAdditionalParams,
                objectTypeCustomizationParams: legendCustomizationParams,
                outerMapBounds,
                setOuterMapBounds,
                isLoading:
                  isLoading || inventoryObjectsData.isLoadingInventoryObjects || !!loadingMarker,
                setEditMode,
                loadingMarker,
                editMode,
                permissions,
                setSelectedObjectParentID,
                objectTypesData,
                isRightPanelOpen,
                setIsRightPanelOpen,
                setTraceRouteValue,
                selectedTraceObject,
                setIsFindPathOpen,
                setFindPathData,
                refetchData: () => {
                  refetchObjectByCoords();
                },
              }}
            />

            {(permissions?.view ?? true) && selectedMap === 'main' && (
              <Legend
                legendData={legendData}
                onObjectTypeCheckBoxClick={onObjectTypeCheckBoxClick}
                onParamTypeCheckBoxClick={onParamTypeCheckBoxClick}
                isLoading={isLoading}
                isLegendOpen={isOpenLegend}
                setLegendOpen={handleLegendButton}
                isRightPanelOpen={isRightPanelOpen}
              />
            )}

            {selectedTab === 'map' && (
              <>
                {isOpenColorSelecting.map && (
                  <ColorSelecting
                    palettes={colorSelectingPalettes}
                    selectedPaletteId={selectPaletteId}
                    tprms={
                      typeof currentTmoId[selectedTab] === 'number'
                        ? objectTypeCustomizationParams?.[currentTmoId[selectedTab] as number]
                            ?.tprms
                        : undefined
                    }
                    handleApplyColors={selectColorRange}
                    disablePortal={isActiveFs}
                  />
                )}
                <ColorSettings isLineWithWidth disablePortal={isActiveFs} />
              </>
            )}
          </FullScreen>
        </Container>
      </SidebarLayout>

      <RightSidePanel
        objectId={selectedObject?.object?.id ?? null}
        isOpen={isRightPanelOpen && selectedTab === 'map'}
        setIsOpen={() => {
          setTraceRouteValue(null);
          setFindPathData(null);
          setIsRightPanelOpen(!isRightPanelOpen);
        }}
        permissions={permissions}
        setSelectedTraceObject={setSelectedTraceObject}
        traceRouteValue={traceRouteValue}
        setTraceRouteValue={setTraceRouteValue}
        setIsFindPathOpen={setIsFindPathOpen}
        isFindPathOpen={isFindPathOpen}
        findPathData={findPathData}
        traceNodesByMoIdKeysValue={traceNodesByMoIdKeysValue}
        setTraceNodesByMoIdKeysValue={setTraceNodesByMoIdKeysValue}
        addTab={(value) => navigate(value.value)}
      />
      {isObjectCRUDModalOpen && selectedTab === 'map' && (
        <CreateObjectComponent
          draggable
          objectId={selectedObject ? selectedObject.object.id : null}
          objectTypeId={selectedObject ? selectedObject.object.tmo_id : null}
          isOpen={isObjectCRUDModalOpen && selectedTab === 'map'}
          selectedObjectParentID={selectedObjectParentID}
        />
      )}

      <DeleteObjectModal
        isOpen={selectedTab === 'map'}
        objectId={selectedObject ? selectedObject.object.id : null}
      />

      {isFindPathOpen && selectedTab === 'map' && (
        <DraggableDialog
          open={isFindPathOpen && selectedTab === 'map'}
          onClose={() => setIsFindPathOpen(false)}
          title={translate('Find a path')}
          minWidth={500}
          minHeight={400}
          width={600}
          height={400}
        >
          <FindPath
            objectId={selectedObject?.object.id ?? null}
            setTraceRouteValue={setTraceRouteValue}
            setFindPathData={setFindPathData}
            setTraceNodesByMoIdKeysValue={setTraceNodesByMoIdKeysValue}
          />
        </DraggableDialog>
      )}
    </MapPageStyled>
  );
};

export default MapPage;
