import { useEffect, memo, useCallback, useRef, useState, useMemo } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import ChecklistIcon from '@mui/icons-material/Checklist';
import { ColorSelecting, ColorSettings } from '3_widgets';
import {
  ILatitudeLongitude,
  OfflineMap,
  IMapInitialViewState,
  OfflineMapTooltip,
  Treemap,
  Button,
  DraggableDialog,
  useDashboardBasedHierarchy,
  MapColumnsSelectData,
  InventoryAndHierarchyObjectTogether,
  LevelSettings,
  useTabs,
  useColorsConfigure,
} from '6_shared';

import { useGetPalettesQuery } from '2_pages/dashboardBasedHierarchy/lib/useGetPalettesQuery';
import type { Map } from 'leaflet';
import { Tooltip } from '@mui/material';
import { useMultipleChartData } from '2_pages/dashboardBasedHierarchy/lib/chart/useMultipleChartData';
import { MapSwitcher } from './map/mapSwitcher/MapSwitcher';
import { MapView } from './map/mapView/MapView';
import { TreemapLayersSortButton } from './treemap/treemapLayersSortButton/TreemapLayersSortButton';

import {
  MapContainer,
  MapSlideContainer,
  NetworkMapStyled,
  MapNavigationContainer,
  SearchAndLayersContainer,
} from './NetworkMap.styled';
import { dispatchNewHierarchyAndChangeLeftAreaType } from '../../lib/dispatchNewHierarchyAndChangeLeftAreaType';
import { HierarchyLevelLegend } from '../hierarchyLevelLegend/HierarchyLevelLegend';
import { useHierarchyLevelsLegendData } from '../../lib/useHierarchyLevelsLegendData';
import { MapColumnsSelect } from '../mapColumnsSelect/MapColumnsSelect';
import { useGetDataForMaps } from '../../lib/useGetDataForMaps';
import { SearchPolygon } from './searchPolygon/SearchPolygon';
import useDebouncedEffect from '../../../../hooks/useDebouncedEffect';
import { Chart } from '../chart/Chart';

interface IProps {
  hierarchyInventoryObjects?: InventoryAndHierarchyObjectTogether[];
  searchValues?: InventoryAndHierarchyObjectTogether[];
  onSearchResultClick?: (data: InventoryAndHierarchyObjectTogether) => void;
  isFetchingSearchValues?: boolean;
  viewType: 'map' | 'tree';
  setViewType: React.Dispatch<React.SetStateAction<'map' | 'tree'>>;
  initialMapState?: IMapInitialViewState;
  isLoading?: boolean;

  currentLevelKpiSettings?: LevelSettings;
  currentHierarchyId?: number | null;
}

export const NetworkMap = memo(
  ({
    hierarchyInventoryObjects,
    searchValues,
    onSearchResultClick,
    isFetchingSearchValues,
    viewType,
    setViewType,
    initialMapState,
    isLoading,
    currentLevelKpiSettings,
    currentHierarchyId,
  }: IProps) => {
    const handleFullScreen = useFullScreenHandle();
    const leafletMapRef = useRef<Map | null>(null);

    const [mapHoveredObject, setMapHoveredObject] =
      useState<InventoryAndHierarchyObjectTogether | null>(null);
    const [mapHoveredObjectPosition, setMapHoveredObjectPosition] =
      useState<ILatitudeLongitude | null>(null);
    const [selectedKPI, setSelectedKPI] = useState<MapColumnsSelectData | undefined>(undefined);

    // const [viewType, setViewType] = useState<'map' | 'tree'>('tree');
    const [maptreeLayersSortOrder, setMaptreeLayersSortOrder] = useState<'asc' | 'desc'>('asc');

    const {
      hierarchyLevels,
      currentHierarchyLevelId,
      selectedHierarchy,
      dateRange,
      selectedEventColumn,
      isMultipleSelectMode,
      multipleSelectedObjects,
      setSelectedEventColumn,
      setIsMultipleSelectMode,
      setMultipleSelectedObjects,
      setHierarchyBreadcrumbs,
      setLeftAreaType,
      setCurrentHierarchyLevelId,
    } = useDashboardBasedHierarchy();

    const { isOpenColorSelecting, setCurrentTmoId, toggleIsOpenColorSelecting } =
      useColorsConfigure();
    const { selectedTab } = useTabs();

    useEffect(() => {
      if (!selectedKPI && selectedEventColumn) setSelectedKPI(selectedEventColumn);
    }, [selectedEventColumn, selectedKPI]);

    const { chartData } = useMultipleChartData({
      // selectedHierarchy,
      currentLevelKpiSettings,
      dateRange,
      selectedObjects: multipleSelectedObjects,
      selectedKPI,
    });

    const eventsColumnsList: MapColumnsSelectData[] = useMemo(() => {
      if (!currentLevelKpiSettings || !selectedHierarchy) return [];

      const clickSettingsEvents = currentLevelKpiSettings?.clickhouse_settings?.events;
      if (!clickSettingsEvents) return [];

      const events = Object.entries(clickSettingsEvents).reduce((acc, [key, value]) => {
        const obj = {
          label: (value.name ?? '') as string,
          value: key,
          aggregation: value.aggregation ?? 'AVG',
        };
        acc.push(obj);
        return acc;
      }, [] as MapColumnsSelectData[]);

      const calculateStress = !!currentLevelKpiSettings?.clickhouse_settings?.calculate_stress;

      if (calculateStress) {
        return [{ label: 'Stress', value: 'Stress', aggregation: 'AVG' }, ...events];
      }
      return events;
    }, [currentLevelKpiSettings, selectedHierarchy]);

    const pseudoTprm = useMemo(() => {
      if (!selectedEventColumn) return undefined;
      return {
        id: selectedEventColumn?.value,
        name: selectedEventColumn?.label,
        val_type: 'number',
      };
    }, [selectedEventColumn]);

    useEffect(() => {
      if (!selectedEventColumn && eventsColumnsList.length) {
        setSelectedEventColumn(eventsColumnsList[0]);
      }

      if (
        selectedEventColumn &&
        !eventsColumnsList.some((el) => el.label === selectedEventColumn.label)
      ) {
        setSelectedEventColumn(eventsColumnsList[0]);
      }
    }, [selectedEventColumn, eventsColumnsList, selectedHierarchy, currentHierarchyLevelId]);

    useEffect(() => {
      if (!selectedHierarchy || !currentHierarchyLevelId) return;

      setCurrentTmoId({
        module: selectedTab,
        tmoId: `${selectedHierarchy.hierarchy_id}-${currentHierarchyLevelId}`,
      });
      setIsMultipleSelectMode(false);
    }, [selectedHierarchy, currentHierarchyLevelId, selectedTab]);

    const { colorRangesData, colorRangesDataSuccess } = useGetPalettesQuery({
      tmo_ids: [`${selectedHierarchy?.hierarchy_id}-${currentHierarchyLevelId}`],
      tprm_ids: selectedEventColumn?.value ? [selectedEventColumn?.value] : [],
      only_description: false,
      limit: 1000,
    });
    const objectKeys = useMemo(() => {
      return hierarchyInventoryObjects?.map((el) => el.key) ?? [];
    }, [hierarchyInventoryObjects]);

    // const { eventsData, isLoadingEventsData } = useReceiveEventsForMap({
    //   objectKeys,
    //   dateRange,
    //   currentLevelKpiSettings,
    // });

    const { dataForTreeMap, dataForMap, isLoadingDistributorData } = useGetDataForMaps({
      hierarchyInventoryObjects,
      currentHierarchyLevelId,
      colorRangesData,
      selectedEventColumn,
      maptreeLayersSortOrder,
      objectKeys,
      dateRange,
      currentLevelKpiSettings,
      currentHierarchyId,
    });

    useDebouncedEffect(
      () => {
        if (isLoading || isLoadingDistributorData) return;
        const mapDatasets = Object.values(dataForMap ?? {});

        const hasData = mapDatasets.some((dataset) => {
          return dataset.features.length > 0;
        });

        if (!hasData) setViewType('tree');
      },
      [dataForMap, isLoading, setViewType, isLoadingDistributorData],
      1500,
    );

    useEffect(() => {
      const { dataPoints } = dataForMap;
      if (dataPoints?.features) {
        const lastElem = dataPoints.features[dataPoints.features.length - 1];
        if (lastElem) {
          const { coordinates } = lastElem.geometry;
          const [lng, lat] = coordinates;
          leafletMapRef.current?.flyTo([lat, lng], 12);
        }
      }
      setMapHoveredObject(null);
      setMapHoveredObjectPosition(null);
    }, [dataForMap]);

    const addObjectToMultipleSelection = useCallback(
      (object: InventoryAndHierarchyObjectTogether) => {
        const hasObject = multipleSelectedObjects.find((el) => {
          return el.key === object.key;
        });
        if (hasObject) {
          const newMultipleSelectedObjects = multipleSelectedObjects.filter((el) => {
            return el.key !== object.key;
          });
          setMultipleSelectedObjects(newMultipleSelectedObjects);
        } else if (multipleSelectedObjects.length < 5) {
          setMultipleSelectedObjects([...multipleSelectedObjects, object]);
        }
      },
      [multipleSelectedObjects],
    );

    const onObjectClick = useCallback(
      (object?: InventoryAndHierarchyObjectTogether) => {
        if (!object) return;
        if (isMultipleSelectMode) {
          addObjectToMultipleSelection(object);
        } else {
          dispatchNewHierarchyAndChangeLeftAreaType(
            setHierarchyBreadcrumbs,
            setLeftAreaType,
            setCurrentHierarchyLevelId,
            object,
            hierarchyLevels,
          );
        }
      },
      [addObjectToMultipleSelection, hierarchyLevels, isMultipleSelectMode],
    );

    useEffect(() => {
      if (!isMultipleSelectMode) setMultipleSelectedObjects([]);
    }, [isMultipleSelectMode]);

    const onMapObjectHover = useCallback((object: InventoryAndHierarchyObjectTogether) => {
      setMapHoveredObject(object);
      const { latitude, longitude } = object;
      setMapHoveredObjectPosition({ longitude, latitude });
    }, []);

    const { active, enter, exit } = handleFullScreen;
    const onMapChange = () => {
      active ? exit() : enter();
    };

    const onSettingsClick = () => {
      toggleIsOpenColorSelecting({ module: selectedTab });
    };

    const { hierarchyLevelLegendData } = useHierarchyLevelsLegendData({
      hierarchyLevels,
      currentLevelId: currentHierarchyLevelId,
      colorRangesData,
    });

    // const onSearchResultClick = useCallback(
    //   async (data: InventoryAndHierarchyObjectTogether) => {
    //     const res = await getHierarchyAndInventoryObjects({});
    //     // dispatchNewHierarchyAndChangeLeftAreaType(dispatch, data, hierarchyLevels);
    //   },
    //   [dispatch, hierarchyLevels],
    // );

    const objectsToSelectCount = useMemo(() => {
      return 5 - multipleSelectedObjects.length;
    }, [multipleSelectedObjects.length]);

    return (
      <NetworkMapStyled>
        <FullScreen handle={handleFullScreen}>
          <MapNavigationContainer>
            <div style={{ display: 'flex', gap: '10px' }}>
              <MapSwitcher handleFullScreen={onMapChange} />
              <MapView mapView={viewType} setMapView={setViewType} />

              {viewType === 'tree' && (
                <TreemapLayersSortButton
                  maptreeLayersSortOrder={maptreeLayersSortOrder}
                  setMaptreeLayersSortOrder={setMaptreeLayersSortOrder}
                />
              )}
              <Tooltip
                open={isMultipleSelectMode}
                title={`You can select ${objectsToSelectCount} more objects: `}
                PopperProps={{ style: { zIndex: 100 } }}
              >
                <Button
                  active={isMultipleSelectMode}
                  onClick={() => {
                    setIsMultipleSelectMode(!isMultipleSelectMode);
                  }}
                >
                  <ChecklistIcon color={isMultipleSelectMode ? 'primary' : 'inherit'} />
                </Button>
              </Tooltip>
            </div>

            <SearchAndLayersContainer>
              <SearchPolygon
                searchResult={searchValues}
                isFetchingObjectsList={isFetchingSearchValues}
                onSearchResultClick={onSearchResultClick}
              />
              {eventsColumnsList.length > 0 && selectedEventColumn && (
                <MapColumnsSelect
                  fullWidth
                  dataList={eventsColumnsList}
                  selectedItem={selectedEventColumn}
                  setSelectedItem={(item: MapColumnsSelectData) => setSelectedEventColumn(item)}
                />
              )}
              {eventsColumnsList.length === 0 && <MapColumnsSelect dataList={[]} />}
            </SearchAndLayersContainer>
          </MapNavigationContainer>
          <MapContainer>
            <div style={{ position: 'absolute', zIndex: 1000, bottom: '20px', right: '20px' }}>
              <HierarchyLevelLegend
                data={hierarchyLevelLegendData}
                onSettingsClick={onSettingsClick}
              />
            </div>
            <MapSlideContainer
              sx={{
                transform: `translateX(${viewType === 'tree' ? '0%' : '-100%'})`,
              }}
            >
              <Treemap
                data={dataForTreeMap}
                onRectClick={({ properties }) =>
                  onObjectClick(properties as InventoryAndHierarchyObjectTogether)
                }
              />
            </MapSlideContainer>
            <MapSlideContainer
              sx={{
                transform: `translateX(${viewType === 'tree' ? '0%' : '-100%'})`,
              }}
            >
              <OfflineMap
                mapRef={leafletMapRef}
                initialViewState={initialMapState}
                polygonData={dataForMap?.dataPolygon}
                multiPolygonData={dataForMap?.dataMultiPolygon}
                // eslint-disable-next-line react/no-unstable-nested-components
                polygonTooltip={(object) => <OfflineMapTooltip object={object as any} />}
                pointsData={dataForMap?.dataPoints}
                onPointHover={onMapObjectHover}
                onPointClick={onObjectClick}
                onMapClick={() => {
                  setMapHoveredObject(null);
                  setMapHoveredObjectPosition(null);
                }}
                onPolygonClick={onObjectClick}
                // eslint-disable-next-line react/no-unstable-nested-components
                pointTooltip={() => <OfflineMapTooltip object={mapHoveredObject as any} />}
                pointTooltipPosition={mapHoveredObjectPosition}
                offline={initialMapState?.isMapOfflineMode === true}
              />
            </MapSlideContainer>
          </MapContainer>
          {isOpenColorSelecting?.[selectedTab] && (
            <ColorSelecting
              palettes={colorRangesData}
              palettesLoaded={colorRangesDataSuccess}
              // selectedPaletteId={selectPaletteId}
              // handleApplyColors={selectColorRange}
              tprms={pseudoTprm}
              disablePortal={active}
            />
          )}
          <ColorSettings disablePortal={active} />

          <DraggableDialog
            open={isMultipleSelectMode}
            resizable={false}
            onClose={() => setIsMultipleSelectMode(false)}
            width={900}
            height={500}
            disablePortal={active}
            dialogContentSx={{ position: 'relative' }}
            title={
              <MapColumnsSelect
                dataList={eventsColumnsList}
                selectedItem={selectedKPI}
                setSelectedItem={setSelectedKPI}
              />
            }
          >
            <div style={{ width: '100%', height: '100%' }}>
              <Chart
                chartData={chartData}
                currentHierarchyLevelId={currentHierarchyLevelId}
                calculateOnlyCurrent
              />
            </div>
          </DraggableDialog>
        </FullScreen>
      </NetworkMapStyled>
    );
  },
);
