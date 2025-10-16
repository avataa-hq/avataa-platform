import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { CircularProgress, SvgIconOwnProps, Tooltip, Box, Modal } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { BBox } from 'geojson';
import { MapEvent } from 'react-map-gl';

import {
  Button,
  GeoJSONPoint,
  Icons,
  useMapDataDistributor,
  useRegistration,
  ActionTypes,
  ConfirmationModal,
  InventoryObjectTypesModel,
  useTranslate,
  IInventoryObjectModel,
  useObjectCRUD,
  useThemeSlice,
  useTabs,
  useInventoryMapWidget,
  IInventoryBoundsModel,
} from '6_shared';
import { LocationSearch } from '4_features';
import { IFindPathData, IRoute } from '5_entites';

import { MAP_INITIAL_STATE } from '6_shared/models/inventoryMapWidget/constants';
import {
  ILoadingMarkerModel,
  IObjectTypeCustomizationParams,
  MapInstanceType,
  MapStyleType,
  SelectedMapType,
} from '6_shared/models/inventoryMapWidget/types';
import { MapSideContainer, MapWidgetStyled } from './MapWidget.styled';
import { ZoomController } from './zoomController/ZoomController';
import { useBoundsData } from '../lib/mainMap/bounds/useBoundsData';
import { ControlContainer } from './controlContainer/ControlContainer';
import { MapToolsContainer } from './mapToolsContainer/MapToolsContainer';
import { MapBoxMap } from './mainMap/MapBoxMap';
import { useClusteredData } from '../lib/useClusteredData';
import { useDrawPolygon } from '../lib/mainMap/useDrawPolygon';
import { SuperClusterOptions } from './superClusterOptions/SuperClusterOptions';
import { Ruler } from '../lib/mainMap/Ruler';
import { useUpdateObjectsCoordinates } from '../lib/useUpdateObjectsCoordinates';
import { LinearProgressWithLabel } from './mainMap/components/LinearProgressWithLabel/LinearProgressWithLabel';
import { MapStyleController } from './mapStyleController/MapStyleController';
import { StreetView } from './streetView/StreetView';
import { useSearch } from '../lib/search/useSearch';
import { useTrace } from '../lib/trace/useTrace';
import { useEvents } from '../lib/mainMap/events/useEvents';
import { useLineUpBetweenPoints } from '../lib/lineUpBetweenPoints/useLineUpBetweenPoints';
import { BuildingPathHint } from './buildingPathHint/BuildingPathHint';
import { BuildingPathPreviewMap } from './buildingPathPreviewMap/BuildingPathPreviewMap';
import { useMapLayersControl } from '../lib';

const { maxZoom, minZoom } = MAP_INITIAL_STATE;

const getOffset = (selectedMap: SelectedMapType) => {
  if (selectedMap === 'sw') return '-100';
  return '0';
};

export interface IMapWidgetProps {
  outerMapBounds?: IInventoryBoundsModel | null;
  setOuterMapBounds?: (bounds: IInventoryBoundsModel) => void;
  mapData?: Record<string, any>[];
  objectTypeCustomizationParams: Record<string, IObjectTypeCustomizationParams>;

  loadingMarker?: ILoadingMarkerModel | null;

  isLoading?: boolean;

  editMode?: boolean;
  setEditMode?: (editMode: boolean) => void;
  permissions?: Record<ActionTypes, boolean>;
  setSelectedObjectParentID?: (id: number | null) => void;
  objectTypesData: InventoryObjectTypesModel[];
  isRightPanelOpen: boolean;
  setIsRightPanelOpen?: (isOpen: boolean) => void;
  selectedTraceObject: IInventoryObjectModel | null;
  setTraceRouteValue?: (value: IRoute | null) => void;
  setIsFindPathOpen?: (value: boolean) => void;
  setFindPathData?: (data: IFindPathData | null) => void;

  refetchData?: () => void;
}

export const MapWidget = memo(
  ({
    outerMapBounds,
    setOuterMapBounds,
    mapData,
    objectTypeCustomizationParams,

    isLoading,
    loadingMarker,

    editMode,
    setEditMode,
    permissions,
    setSelectedObjectParentID,
    objectTypesData,
    isRightPanelOpen,
    setIsRightPanelOpen,
    setTraceRouteValue,
    selectedTraceObject,
    setIsFindPathOpen,
    setFindPathData,
    refetchData,
  }: IMapWidgetProps) => {
    useRegistration('inventoryMapWidget');
    useRegistration('leftPanelWidget');

    const translate = useTranslate();

    const rulerRef = useRef<Ruler | null>(null);
    const totalRulerDistance = rulerRef.current?.totalDistance;
    const mapInstanceRef = useRef<MapInstanceType | null>(null);

    // region STATES
    const [paddingMapBounds, setPaddingMapBounds] = useState<IInventoryBoundsModel | null>(null);
    const [mapBounds, setMapBounds] = useState<BBox | undefined>();
    const [updatekey, setUpdatekey] = useState(0);
    const [rulerDistance, setRulerDistance] = useState(0);
    const [newDataPoints, setNewDataPoints] = useState<
      GeoJSONPoint<IInventoryObjectModel> | undefined
    >();
    const [selectedMapStyle, setSelectedMapStyle] = useState<MapStyleType>('Default');
    const [movingObjectModalOpen, setMovingObjectModalOpen] = useState(false);
    const [mapEvent, setMapEvent] = useState<MapEvent<any> | null>(null);
    const [shouldCloseContextMenu, setShouldCloseContextMenu] = useState(false);
    const [mapInstanceFromEvent, setMapInstanceFromEvent] = useState<MapInstanceType | null>(null);

    const { mode } = useThemeSlice();
    const { selectedTab } = useTabs();
    const {
      objectCRUDComponentUi: { isObjectCRUDModalOpen },
    } = useObjectCRUD();

    const {
      selectedMap,
      mapViewState,
      isDrawPolygon,
      isDrawRuler,
      selectedObjectList,
      setMapViewState,
      setMapData,
      setSelectedObject,
      setSelectedObjectList,
      setIsDraw,
    } = useInventoryMapWidget();

    // endregion

    // region HOOKS
    const {
      distributorData: {
        dataPoints: inventoryDataPoints,
        dataMultiPolygon: inventoryDataMultiPolygon,
        dataPolygon: inventoryDataPolygon,
        dataLineString: inventoryDataLineString,
      },
      isLoadingDistributorData,
      isErrorDistributorData,
    } = useMapDataDistributor<IInventoryObjectModel>({ data: mapData as any });

    const {
      getObjectAndCoordinatesToUpdate,
      updateObjectsCoordinates,
      updateProgress,
      setUpdateProgress,
      setObjectsToUpdate,
      setLinePoints,
      getLineSelectedObject,
      getParentOrObject,
      hasParentMovedObject,
      isLoadingDataForMoveObject,
    } = useUpdateObjectsCoordinates({
      editMode,
      rulerDistance,
      objectTypeCustomizationParams,
      isActiveRulerTool: isDrawRuler,
    });

    const { dataPoints, dataMultiPolygon, dataPolygon, dataLineString, tileServers } =
      useMapLayersControl({
        inventoryDataPoints,
        inventoryDataMultiPolygon,
        inventoryDataPolygon,
        inventoryDataLineString,
      });

    const {
      supercluster,
      clusters,
      isOpenClusterOption,
      setIsOpenClusterOption,
      setClusterOptions,
      clusterOptions,
    } = useClusteredData({
      currentBounds: mapBounds,
      mapViewState,
      dataPoints: newDataPoints,
      selectedMap,
    });

    const { setBounds } = useBoundsData({
      mapViewState,
      setOuterMapBounds,
      setPaddingMapBounds,
      mapBoxInstance: mapInstanceRef,
    });

    const {
      drawPolygonInstance,
      onClickDrawPolygon,
      polygonArea,
      clearAllPolygon,
      polygonCoordinates,
    } = useDrawPolygon({
      mapRef: mapInstanceRef,
      mapData,
    });

    const onSearchPlace = useSearch({ mapData, editMode, setIsRightPanelOpen });

    useTrace({ selectedTraceObject, mapData });
    // endregion

    const {
      isBuildPathBetweenPointsMode,
      setIsBuildPathBetweenPointsMode,
      selectedObjectToBuildPath,
      onPointClickWhenEditAndBuildPathBetweenPoint,

      onCancelFromHintClick,
      onSaveFromHintClick,
      haveTwoPoints,

      isOpenPreviewMap,
      setIsOpenPreviewMap,
      buildingPathResult,
      errorMessage,

      onSaveFromBuildingPathMap,
      onCancelFromBuildingPathMap,
      isLoadingBuildingPath,
      isLoadingUpdateCoordinates,
    } = useLineUpBetweenPoints({
      selectedObjectList,
      objectTypeCustomizationParams,
      dataPoints,
      refetchData,
      onSaveSuccess: () => {
        clearAllPolygon();
        setIsDraw({ what: 'polygon', value: false });
      },
    });

    const handleCloseContextMenu = useCallback(() => {
      setShouldCloseContextMenu(!shouldCloseContextMenu);
    }, [shouldCloseContextMenu]);

    const getMapInstanceFromEvent = useCallback(
      (newMapInstance: MapInstanceType | null) => {
        if (newMapInstance) {
          setMapInstanceFromEvent(newMapInstance);
        }
      },
      [setMapInstanceFromEvent],
    );

    useEffect(() => {
      if (!editMode) {
        setIsBuildPathBetweenPointsMode(false);
      }
    }, [editMode, setIsBuildPathBetweenPointsMode]);

    useEffect(() => {
      if (mapInstanceFromEvent && !mapInstanceRef.current) {
        mapInstanceRef.current = mapInstanceFromEvent;
      }
    }, [mapInstanceFromEvent, mapInstanceRef]);

    // region useEffects
    useEffect(() => {
      setNewDataPoints(dataPoints);
    }, [dataPoints]);

    useEffect(() => {
      if (totalRulerDistance !== undefined) setRulerDistance(totalRulerDistance);
    }, [totalRulerDistance, updatekey]);

    useEffect(() => {
      if (editMode && !isObjectCRUDModalOpen) {
        setIsDraw({ what: 'ruler', value: false });
        rulerRef.current?.setActive(false);
        rulerRef.current?.clearAll();
      }
    }, [editMode, isObjectCRUDModalOpen]);

    useEffect(() => {
      if (isDrawPolygon) {
        setIsDraw({ what: 'ruler', value: false });
        rulerRef.current?.clearAll();
      }
    }, [isDrawPolygon, handleCloseContextMenu]);

    useEffect(() => {
      if (selectedMap === 'sw') {
        setIsDraw({ what: 'ruler', value: false });
        setIsDraw({ what: 'polygon', value: false });
        rulerRef.current?.clearAll();
        rulerRef.current = null;
      }
    }, [selectedMap]);

    useEffect(() => {
      if (rulerRef.current === null && mapEvent && selectedTab === 'map') {
        rulerRef.current = new Ruler(mapEvent.target);
      }
    }, [mapEvent, selectedTab, selectedMap]);
    // endregion

    const handleZoom = useCallback(
      (eventType: 'in' | 'out') => {
        const prevZoom = mapViewState.zoom;
        let nextZoom = prevZoom;

        if (!(prevZoom >= maxZoom) && eventType === 'in') nextZoom++;
        if (!(prevZoom <= minZoom) && eventType === 'out') nextZoom--;

        const newViewState = { ...mapViewState, zoom: nextZoom };
        setMapViewState(newViewState);

        mapInstanceRef?.current?.zoomTo(nextZoom);
        setBounds({ ...mapViewState, zoom: nextZoom }, outerMapBounds, paddingMapBounds);
      },
      [mapViewState, setBounds, outerMapBounds, paddingMapBounds],
    );

    const onRulerButtonClick = () => {
      handleCloseContextMenu();
      setIsDraw({ what: 'ruler', value: !isDrawRuler });
      clearAllPolygon();
      if (!isDrawRuler) {
        setSelectedObject(null);
        rulerRef.current?.setActive(true);
      } else {
        rulerRef.current?.clearAll();
      }
    };

    const handleEditMode = () => {
      handleCloseContextMenu();
      setEditMode?.(!editMode);
      // setNewDataPoints(dataPoints);
      if (isDrawRuler) {
        setIsDraw({ what: 'ruler', value: false });
        rulerRef.current?.setActive(false);
        rulerRef.current?.clearAll();
      }
    };

    const onApplyChanges = async () => {
      handleEditMode();
      await updateObjectsCoordinates();
      setUpdateProgress(0);
    };

    const onCancelChangesClick = () => {
      setObjectsToUpdate([]);
      handleEditMode();
      setUpdateProgress(0);
      setNewDataPoints(dataPoints);
    };

    const onSaveChangesClick = async () => {
      if (hasParentMovedObject) {
        setMovingObjectModalOpen(true);
      } else {
        await onApplyChanges();
      }
    };

    const onConfirmChangesFromModal = async () => {
      await onApplyChanges();
      setMovingObjectModalOpen(false);
    };
    const onCancelChangesFromModal = () => {
      setMovingObjectModalOpen(false);
      onCancelChangesClick();
    };
    const mapboxEvents = useEvents({
      mapViewState,
      rulerRef,
      drawPolygonInstance,
      isActiveRulerTool: isDrawRuler,
      setLinePoints,
      editMode,
      setUpdatekey,
      setBounds,
      outerMapBounds,
      paddingMapBounds,
      setMapBounds,
      setNewDataPoints,
      dataPoints,
      newDataPoints,
      getObjectAndCoordinatesToUpdate,
      getLineSelectedObject,
      getParentOrObject,
      mapInstance: mapInstanceRef,
    });

    const getMapEvent = useCallback((e: MapEvent<any>) => {
      setMapEvent(e);
    }, []);

    const getEditButtonColor = (): SvgIconOwnProps['color'] => {
      if (editMode) return 'primary';
      if (!(permissions?.update ?? true)) return 'disabled';
      return 'inherit';
    };

    const onClearSearchClick = () => {
      setMapData([]);
    };

    // Build path between points events and props
    const onBuildPathClick = () => {
      handleCloseContextMenu();
      setIsBuildPathBetweenPointsMode((v) => !v);

      setSelectedObject(null);
      setSelectedObjectList([]);

      setIsDraw({ what: 'ruler', value: false });
      rulerRef.current?.setActive(false);
      rulerRef.current?.clearAll();

      setIsDraw({ what: 'polygon', value: false });
      clearAllPolygon();
    };

    const onPolygonButtonFromHintClick = () => {
      handleCloseContextMenu();
      onClickDrawPolygon();
    };

    const haveSelectedZone = useMemo(() => {
      return isDrawPolygon && !!selectedObjectList.length;
    }, [isDrawPolygon, selectedObjectList]);

    const collectedListOfSelectedObjects = useMemo(() => {
      return [...selectedObjectList, ...selectedObjectToBuildPath];
    }, [selectedObjectList, selectedObjectToBuildPath]);

    return (
      <MapWidgetStyled offset={getOffset(selectedMap)}>
        <MapSideContainer
          style={{ ...(selectedMap === 'sw' && { visibility: 'hidden', width: 0, height: 0 }) }}
        >
          <MapBoxMap
            mapInstanceRef={mapInstanceRef}
            loadingMarker={loadingMarker}
            isError={isErrorDistributorData}
            mapEvents={mapboxEvents}
            isLoading={isLoading || isLoadingDistributorData || isLoadingUpdateCoordinates}
            themeMode={mode}
            supercluster={supercluster}
            clusters={clusters}
            cursor={isDrawRuler || isDrawPolygon ? 'crosshair' : undefined}
            selectedObjectList={collectedListOfSelectedObjects}
            polygonCoordinates={polygonCoordinates}
            editMode={editMode}
            isRulerActive={isDrawRuler}
            mapStyle={selectedMapStyle}
            dataGeometry={dataLineString}
            dataPolygon={dataPolygon}
            dataMultiPolygon={dataMultiPolygon}
            mapData={mapData}
            rulerSourceData={rulerRef.current?.sourceData}
            permissions={permissions}
            setSelectedObjectParentID={setSelectedObjectParentID}
            getMapEvent={getMapEvent}
            objectTypesData={objectTypesData}
            onPointClickWhenEditAndBuildPathBetweenPoint={
              editMode && isBuildPathBetweenPointsMode
                ? onPointClickWhenEditAndBuildPathBetweenPoint
                : undefined
            }
            shouldCloseContextMenu={shouldCloseContextMenu}
            tileServers={tileServers}
            setIsRightPanelOpen={setIsRightPanelOpen}
            setTraceRouteValue={setTraceRouteValue}
            setIsFindPathOpen={setIsFindPathOpen}
            setFindPathData={setFindPathData}
            getMapInstanceFromEvent={getMapInstanceFromEvent}
          />
        </MapSideContainer>
        <MapSideContainer>
          {selectedMap === 'sw' && (
            <StreetView
              isLoading={isLoading || isLoadingDistributorData}
              lineStringData={dataLineString}
              multiPolygonData={dataMultiPolygon}
              polygonData={dataPolygon}
              supercluster={supercluster}
              clusters={clusters}
              setGeneralBounds={setMapBounds}
              // topRightContainer={
              //   <LocationSearch
              //     sx={{
              //       width: 250,
              //       backgroundColor: ({ palette }) => palette.neutralVariant.outline,
              //       borderRadius: '10px',
              //     }}
              //     onSelectPlace={onSearchPlace}
              //     searchIcon
              //     visibleClearIcon
              //     disablePortal
              //   />
              // }
            />
          )}
        </MapSideContainer>
        <Box
          component="div"
          sx={(theme) => ({
            position: 'absolute',
            display: 'flex',
            gap: '10px',
            top: '20px',
            right: '20px',
            transition: '0.2s',
            ...(isRightPanelOpen && {
              top: '70px',
              left: '20px',
            }),
            [theme.breakpoints.down('md')]: {
              top: '70px',
              left: '20px',
            },
          })}
        >
          <MapToolsContainer
            sx={(theme) => ({
              transition: '0.2s',
              justifyContent: 'flex-end',
              ...(isRightPanelOpen && {
                justifyContent: 'flex-start',
              }),
              [theme.breakpoints.down('md')]: {
                justifyContent: 'flex-start',
              },
            })}
          >
            {!editMode && (
              <Button
                active={editMode}
                onClick={handleEditMode}
                disabled={!(permissions?.update ?? true)}
              >
                <EditIcon color={getEditButtonColor()} />
              </Button>
            )}
            {editMode && (
              <>
                <Button
                  active={editMode}
                  onClick={onSaveChangesClick}
                  disabled={!(permissions?.update ?? true) || isLoadingDataForMoveObject}
                >
                  {isLoadingDataForMoveObject ? (
                    <CircularProgress size={23} />
                  ) : (
                    <CheckIcon color="success" />
                  )}
                </Button>
                <Button active={editMode} onClick={onCancelChangesClick}>
                  <CloseIcon color="error" />
                </Button>
              </>
            )}
            {editMode && (
              <Button
                active={isBuildPathBetweenPointsMode}
                onClick={onBuildPathClick}
                disabled={!(permissions?.update ?? true)}
              >
                <TrendingUpIcon color={isBuildPathBetweenPointsMode ? 'primary' : 'inherit'} />
              </Button>
            )}
            {isDrawRuler && (
              <Tooltip
                open={isDrawRuler}
                title={`${rulerDistance?.toFixed()} m`}
                PopperProps={{ style: { zIndex: 100 } }}
              >
                <div>
                  <Button active={isDrawRuler} onClick={() => onRulerButtonClick()}>
                    <Icons.RulerIcon color={isDrawRuler ? 'primary' : 'inherit'} />
                  </Button>
                </div>
              </Tooltip>
            )}
            {!isDrawRuler && (
              <Tooltip title={translate('Right-click to finish drawing the line on the map')}>
                <div>
                  <Button active={isDrawRuler} onClick={() => onRulerButtonClick()}>
                    <Icons.RulerIcon color={isDrawRuler ? 'primary' : 'inherit'} />
                  </Button>
                </div>
              </Tooltip>
            )}

            <Tooltip
              open={isDrawPolygon && selectedTab === 'map'}
              title={polygonArea}
              PopperProps={{ style: { zIndex: 100 } }}
            >
              <div>
                <Button
                  active={isDrawPolygon}
                  onClick={() => {
                    onClickDrawPolygon?.();
                    handleCloseContextMenu();
                  }}
                >
                  <Icons.PolygonIcon color={isDrawPolygon ? 'primary' : 'inherit'} />
                </Button>
              </div>
            </Tooltip>
            <MapStyleController
              onChangeMapStyle={setSelectedMapStyle}
              selectedStyle={selectedMapStyle}
              mapType={selectedMap === '3d' ? '3d' : '2d'}
              handleCloseContextMenu={handleCloseContextMenu}
            />

            <LocationSearch
              sx={(theme) => {
                return {
                  width: 250,
                  backgroundColor: theme.palette.neutralVariant.outline,
                  borderRadius: '10px',
                  [theme.breakpoints.down(isRightPanelOpen ? 'xl' : 'lg')]: {
                    mt: 1,
                    width: '70%',
                    maxWidth: '70%',
                  },
                };
              }}
              onSelectPlace={onSearchPlace}
              onClearSearchClick={onClearSearchClick}
              handleCloseContextMenu={handleCloseContextMenu}
              searchIcon
              visibleClearIcon
              disablePortal
            />
          </MapToolsContainer>
          <Box component="div" sx={{ width: '50%', position: 'absolute', top: '-20px' }}>
            {updateProgress > 0 && <LinearProgressWithLabel value={updateProgress} />}
          </Box>
        </Box>
        <ControlContainer position="center-right" sx={{ right: '20px' }}>
          {!isLoading && <ZoomController onClick={handleZoom} />}
        </ControlContainer>
        {isOpenClusterOption && (
          <SuperClusterOptions
            clusterOptions={clusterOptions}
            setOptions={setClusterOptions}
            isOpen={isOpenClusterOption}
            setIsOpen={setIsOpenClusterOption}
          />
        )}
        <ConfirmationModal
          message="You are moving parent object. Do you want to proceed with the changes?"
          isOpen={movingObjectModalOpen}
          setIsOpen={setMovingObjectModalOpen}
          onCancel={onCancelChangesFromModal}
          onConfirm={onConfirmChangesFromModal}
        />
        {editMode && isBuildPathBetweenPointsMode && (
          <BuildingPathHint
            haveTwoPoints={haveTwoPoints}
            haveSelectedZone={haveSelectedZone}
            onCancelClick={onCancelFromHintClick}
            onSaveClick={onSaveFromHintClick}
            onPolygonButtonClick={onPolygonButtonFromHintClick}
            isActivePolygonTool={isDrawPolygon}
            errorMessage={errorMessage}
            isLoading={isLoadingBuildingPath}
          />
        )}
        <Modal
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          open={isOpenPreviewMap}
          onClose={() => setIsOpenPreviewMap(false)}
        >
          <div>
            <BuildingPathPreviewMap
              mapViewState={{
                ...mapViewState,
                zoom: mapViewState.zoom > 14 ? 14 : mapViewState.zoom,
                bearing: 80,
              }}
              mapStyle={selectedMapStyle}
              themeMode={mode}
              buildingPaths={buildingPathResult}
              onSaveClick={onSaveFromBuildingPathMap}
              onCancelClick={onCancelFromBuildingPathMap}
              isLoading={isLoadingBuildingPath}
              errorMessage={errorMessage}
            />
          </div>
        </Modal>
      </MapWidgetStyled>
    );
  },
);
