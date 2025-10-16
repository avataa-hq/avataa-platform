import { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { Box, useTheme } from '@mui/material';
import Map, { MapEvent, MapLayerMouseEvent, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Supercluster, { AnyProps } from 'supercluster';
import { zoomies, lineSpinner } from 'ldrs';
import { enqueueSnackbar } from 'notistack';

import config from 'config';
import {
  GeoJSONLineString,
  GeoJSONMultiPolygon,
  GeoJSONPoint,
  GeoJSONPolygon,
  ILatitudeLongitude,
  ActionTypes,
  useGetPermissions,
  getCoordinatesFromInventoryObject,
  InventoryObjectTypesModel,
  IInventoryObjectModel,
  useTabs,
  useInventoryMapWidget,
} from '6_shared';

import { IFindPathData, IRoute } from '5_entites';
import { MAP_CONTEXT_MENU_OPTIONS } from '6_shared/models/inventoryMapWidget/constants';
import {
  ILoadingMarkerModel,
  IMapboxEvents,
  IMapBoxObjectCustomEvent,
  IMapboxObjectsEvents,
  ISelectedInventoryObject,
  MapInstanceType,
  MapStyleType,
  PointsBetweenLine,
} from '6_shared/models/inventoryMapWidget/types';
import { LoadingContainer } from './MainMap.styled';
import { MapBoxContextMenu } from './components/mapBoxContextMenu/MapBoxContextMenu';
import { MapBoxMarker } from './components/mapBoxMarker/MapBoxMarker';
import { ComposedClusterLayer } from './layers/mapBoxClusterLayer/ComposedClusterLayer';
import { useMapBoxContextMenu } from '../../lib/useMapBoxContextMenu';
import { FileViewerWidget } from '../../../fileViewerWidget';
import { usePolygonContextMenu } from '../../lib/usePolygonContextMenu';
import { MarkerSimilarObjectsContextMenu } from './components/markerSimilarObjectsContetMenu/MarkerSimilarObjectsContextMenu';
import { useSizeNormalize } from '../../lib/mainMap/useSizeNormalize';
import { MapBoxLineLayer } from './layers/mapBoxLineLayer/MapBoxLineLayer';
import { useMapContextMenu } from '../../lib/useMapContextMenu';
import { MapBoxPolygonLayer } from './layers/mapBoxPolygonLayer/MapBoxPolygonLayer';
import { MapBoxModelLayer } from './layers/mapBoxModelLayer/MapBoxModelLayer';
import { ClusterGroupContextMenuTree } from './components/clusterGroupContextMenuTree/ClusterGroupContextMenuTree';
import { SuperClusterChildren } from '../../lib/useClusteredData';
import { LINE_LAYER_ID } from './layers/mapBoxLineLayer/lineLayerCfg';
import { RulerSourceDataType } from '../../lib/mainMap/Ruler';
import { MapBoxRulerLayer } from './layers/mapBoxRulerLayer/MapBoxRulerLayer';
import { transformPropsFromJSON } from '../../lib/transformParamsFromJSON';
import { MapBoxPointsBetweenLineLayer } from './layers/mapBoxPointsBetweenLineLayer/MapBoxPointsBetweenLineLayer';
import { getMapStyle } from '../../lib/getMapStyle';
import {
  MULTIPOLYGON_LAYER_ID,
  POLYGON_LAYER_ID,
} from './layers/mapBoxPolygonLayer/polygonLayerCfg';
import { MapBoxTileLayer } from './layers/mapBoxTileLayer/MapBoxTileLayer';

lineSpinner.register();

type IMapBoxContextMenuList = 'map' | 'marker' | 'polygon' | 'cluster' | 'similar';

zoomies.register();

const MapBoxMapStyled = styled(Box)`
  width: 100%;
  height: 100%;
  position: relative;
`;

const hasPolygonByClick = (e: MapLayerMouseEvent) => {
  const clickedObjects = e.target.queryRenderedFeatures(e.point);
  return clickedObjects.some((obj) => obj.layer.id.includes('gl-draw-polygon'));
};

const getClickedObjectLineFromMap = (e: MapLayerMouseEvent): ISelectedInventoryObject | null => {
  let selObj: ISelectedInventoryObject | null = null;
  const elem = e.target.queryRenderedFeatures(e.point, { layers: [LINE_LAYER_ID] });
  if (elem.length) {
    const properties = ['geometry', 'similarObjects'];
    if (elem[0].properties) {
      const transformedObj = transformPropsFromJSON(elem[0].properties, properties) as any;
      selObj = {
        object: transformedObj,
        position: { latitude: e.lngLat.lat, longitude: e.lngLat.lng, ...e.point },
      };
    }
  }
  return selObj;
};

const getClickedObjectPolygonFromMap = (e: MapLayerMouseEvent): ISelectedInventoryObject | null => {
  let selObj: ISelectedInventoryObject | null = null;
  const elem = e.target.queryRenderedFeatures(e.point, {
    layers: [POLYGON_LAYER_ID, MULTIPOLYGON_LAYER_ID],
  });
  if (elem.length) {
    const properties = ['geometry', 'similarObjects'];
    if (elem[0].properties) {
      const transformedObj = transformPropsFromJSON(elem[0].properties, properties) as any;
      selObj = {
        object: transformedObj,
        position: { latitude: e.lngLat.lat, longitude: e.lngLat.lng, ...e.point },
      };
    }
  }
  return selObj;
};

interface IProps {
  themeMode?: 'dark' | 'light';
  mapStyle?: MapStyleType;
  mapInstanceRef: MutableRefObject<MapInstanceType | null>;

  selectedObjectList?: Record<string, any>[];

  isLoading?: boolean;
  isError?: boolean;
  editMode?: boolean;
  isRulerActive?: boolean;
  loadingMarker?: ILoadingMarkerModel | null;

  clusters?: SuperClusterChildren[];
  supercluster?: Supercluster<IInventoryObjectModel, AnyProps>;

  cursor?: string;
  polygonCoordinates: GeoJSON.Position[];
  dataGeometry?: GeoJSONLineString<IInventoryObjectModel>;
  dataPolygon?: GeoJSONPolygon<IInventoryObjectModel>;
  dataMultiPolygon?: GeoJSONMultiPolygon<IInventoryObjectModel>;
  mapEvents: IMapboxEvents & IMapboxObjectsEvents;
  mapData?: Record<string, any>[];
  rulerSourceData?: RulerSourceDataType[];
  permissions?: Record<ActionTypes, boolean>;
  setSelectedObjectParentID?: (id: number | null) => void;
  getMapEvent: (e: MapEvent<any>) => void;
  objectTypesData: InventoryObjectTypesModel[];
  tileServers: { id: number; url: string }[];
  setIsRightPanelOpen?: (isOpen: boolean) => void;
  setTraceRouteValue?: (value: IRoute | null) => void;
  setIsFindPathOpen?: (value: boolean) => void;
  setFindPathData?: (data: IFindPathData | null) => void;

  onPointClickWhenEditAndBuildPathBetweenPoint?: (clickedObject?: ISelectedInventoryObject) => void;
  shouldCloseContextMenu: boolean;
  getMapInstanceFromEvent: (newMapInstance: MapInstanceType | null) => void;
}

export const MapBoxMap = ({
  themeMode = 'dark',
  mapStyle = 'Default',
  mapInstanceRef,

  isLoading,
  isError,
  editMode,
  isRulerActive,
  loadingMarker,

  selectedObjectList,

  clusters,
  supercluster,

  cursor,
  polygonCoordinates,
  dataGeometry,
  dataPolygon,
  dataMultiPolygon,
  mapData,
  tileServers,

  mapEvents,
  rulerSourceData,
  permissions,
  setSelectedObjectParentID,
  getMapEvent,
  objectTypesData,

  onPointClickWhenEditAndBuildPathBetweenPoint,
  shouldCloseContextMenu,
  setIsRightPanelOpen,
  setTraceRouteValue,
  setIsFindPathOpen,
  setFindPathData,
  getMapInstanceFromEvent,
}: IProps) => {
  const mapContainerRef = useRef<HTMLElement | null>(null);

  const { palette } = useTheme();
  useSizeNormalize({ mapInstance: mapInstanceRef });

  const detailsPermissions = useGetPermissions('details');
  const diagramsPermissions = useGetPermissions('diagrams');
  const inventoryPermissions = useGetPermissions('inventory');

  const {
    onMapViewStateChange,
    onMapMouseMove,
    onMapClick,
    onMapContextMenu,
    onMapLoad,
    onMapDblClick,
    onObjectOnMapClick,
    onObjectOnMapDragEnd,
  } = mapEvents;

  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [mapContextMenuPosition, setMapContextMenuPosition] = useState<
    ISelectedInventoryObject['position'] | null
  >(null);
  const [polygonMenuPosition, setPolygonMenuPosition] = useState<
    ISelectedInventoryObject['position'] | null
  >(null);
  const [markersContextMenuPosition, setMarkersContextMenuPosition] =
    useState<ILatitudeLongitude | null>(null);
  const [markerSimilarObjects, setMarkerSimilarObjects] = useState<IInventoryObjectModel[]>([]);
  const [isFileViewerOpen, setIsFileViewerOpen] = useState(false);
  const [pointsWithModel, setPointsWithModel] = useState<GeoJSONPoint<any>['features']>([]);
  const [isRightClick, setIsRightClick] = useState(false);
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timer | null>(null);
  const [clickedClusterId, setClickedClusterId] = useState<number | null>(null);
  const [clusterChildrenTreePosition, setClusterChildrenTreePosition] =
    useState<ILatitudeLongitude | null>(null);
  const [pointsBetweenLine, setPointsBetweenLine] = useState<PointsBetweenLine[]>([]);

  const {
    selectedObject,
    markerPosition,
    tempCoordinates,
    mapViewState,
    selectedMap,
    isMapLegendOpen,
    setSelectedObject,
    setMarkerPosition,
  } = useInventoryMapWidget();

  const { selectedTab } = useTabs();

  const isThreeD = selectedMap === '3d';

  const closeAllContextMenus = (exception?: IMapBoxContextMenuList) => {
    if (exception !== 'marker') setIsContextMenuOpen(false);
    if (exception !== 'map') setMapContextMenuPosition(null);
    if (exception !== 'polygon') setPolygonMenuPosition(null);
    if (exception !== 'cluster') setClusterChildrenTreePosition(null);
    if (exception !== 'similar') {
      setMarkersContextMenuPosition(null);
      setMarkerSimilarObjects([]);
    }
  };

  useEffect(() => {
    closeAllContextMenus();
  }, [shouldCloseContextMenu, isMapLegendOpen]);

  useEffect(() => {
    if (mapInstanceRef.current?.resize) {
      mapInstanceRef.current?.resize();
    }
  }, [mapInstanceRef, selectedTab]);

  useEffect(() => {
    if (!tempCoordinates || !mapInstanceRef.current) return;
    setTimeout(() => {
      mapInstanceRef.current?.flyTo({
        center: { lat: tempCoordinates.latitude, lng: tempCoordinates.longitude },
        zoom: tempCoordinates.zoom,
        screenSpeed: tempCoordinates.speed ?? 3,
      });
    }, 500);
  }, [mapInstanceRef, tempCoordinates]);

  useEffect(() => {
    const features = dataGeometry?.features;
    if (features) {
      const res: PointsBetweenLine[] = [];
      features.forEach((f) => {
        const { properties } = f;
        if (properties.similarObjects) {
          const position = getCoordinatesFromInventoryObject(properties);
          if (position) {
            res.push({
              id: properties.id,
              count: properties.similarObjects.length + 1,
              position,
              consistsObjects: [properties, ...properties.similarObjects],
              color: properties.color,
            });
          }
        }
      });
      setPointsBetweenLine(res);
    }
  }, [dataGeometry]);

  const { onMapBoxContextMenuItemClick, mapboxContextMenuOptions } = useMapBoxContextMenu({
    object: selectedObject?.object,
    setIsFileViewerOpen,
    setIsContextMenuOpen,
    objectTypesData,
    setIsFindPathOpen,
  });

  const { onContextMenuItemClick } = useMapContextMenu({
    mapData,
    mapBounds: mapInstanceRef.current?.getBounds(),
    mapContainerRef,
  });

  const { onPolygonContextMenuItemClick, polygonContextMenuOptions } = usePolygonContextMenu({
    polygonCoordinates,
    selectedObjectList,
    polygonMenuPosition,
  });

  const onSimilarObjectsContextMenuClose = useCallback(() => {
    setMarkersContextMenuPosition(null);
    setMarkerSimilarObjects([]);
  }, []);

  const pickedSimilarObjects = useCallback(
    (clickedObject: ISelectedInventoryObject) => {
      if (isRulerActive) return;
      const { position, object } = clickedObject;
      const { similarObjects } = object;
      const { latitude, longitude } = position;

      if (similarObjects?.length) {
        closeAllContextMenus('similar');
        setMarkerSimilarObjects([object, ...similarObjects]);
        if (latitude != null && longitude != null) {
          setMarkersContextMenuPosition({ latitude, longitude });
        }
      } else {
        setSelectedObject(clickedObject);
        setIsRightPanelOpen?.(!!clickedObject && !editMode);
      }
    },
    [editMode, isRulerActive, setIsRightPanelOpen],
  );

  const onClusterGroupClick = useCallback(
    (coordinates?: [number, number], newZoom?: number) => {
      const currentZoom = mapInstanceRef?.current?.getZoom();
      if (coordinates && currentZoom) {
        mapInstanceRef?.current?.flyTo({ center: coordinates, zoom: newZoom || 18, speed: 2 });
      }
    },
    [mapInstanceRef],
  );
  const onClusterGroupContextMenu = useCallback(
    (clusterId: number, pointCount: number, coordinates?: [number, number]) => {
      if (pointCount > 2500) {
        enqueueSnackbar({ variant: 'info', message: 'Too many objects, please, zoom in' });
        return;
      }

      if (coordinates) {
        closeAllContextMenus('cluster');
        setClusterChildrenTreePosition({ latitude: coordinates[1], longitude: coordinates[0] });
        setClickedClusterId(clusterId);
      }
    },
    [],
  );

  const onClusterGroupContextmenuItemClick = useCallback(
    (clickedObject: ISelectedInventoryObject) => {
      setSelectedObject(clickedObject);
      setIsRightPanelOpen?.(true);
    },
    [],
  );

  const onMarkerClick = useCallback(
    (eventInfo: IMapBoxObjectCustomEvent, clickedObject?: ISelectedInventoryObject) => {
      onSimilarObjectsContextMenuClose();

      // Path construction mode between points
      if (onPointClickWhenEditAndBuildPathBetweenPoint) {
        onPointClickWhenEditAndBuildPathBetweenPoint(clickedObject);
        return;
      }

      if (clickedObject) {
        setSelectedObjectParentID?.(clickedObject.object.p_id);
      }
      onObjectOnMapClick?.(eventInfo, clickedObject);
      // if (editMode) onObjectOnMapClick?.(eventInfo, clickedObject);
      setFindPathData?.(null);
      setTraceRouteValue?.(null);

      if (markerPosition) setMarkerPosition(null);
      if (clickedObject) pickedSimilarObjects(clickedObject);
    },
    [
      markerPosition,
      onObjectOnMapClick,
      pickedSimilarObjects,
      onPointClickWhenEditAndBuildPathBetweenPoint,
    ],
  );

  const onModelObjectClick = useCallback(
    (clickedObject: ISelectedInventoryObject) => {
      if (clickedObject) pickedSimilarObjects(clickedObject);
    },
    [pickedSimilarObjects],
  );

  const onMarkerContextMenu = useCallback(
    (clickedObject?: ISelectedInventoryObject | null) => {
      if (!selectedObject && clickedObject) {
        setSelectedObject(clickedObject);
      }
      if (selectedObject && clickedObject) {
        const selObject = selectedObject.object;
        const clObject = clickedObject.object;
        const clObjectSimilarObjects = clickedObject.object.similarObjects;
        const similarIds = clObjectSimilarObjects?.map((so) => so.id);

        if (selObject?.id !== clObject?.id && !similarIds?.includes(selObject.id)) {
          setSelectedObject(clickedObject);
        }
      }
      closeAllContextMenus('marker');
      setIsContextMenuOpen(true);
    },
    [selectedObject],
  );

  const onMarkerSimilarObjectClick = (clickedObj: ISelectedInventoryObject | null) => {
    if (clickedObj) {
      setIsRightPanelOpen?.(!!clickedObj && !editMode);
      setSelectedObject(clickedObj);
    }
  };

  const mapClickFn = useCallback((e: MapLayerMouseEvent) => {
    e.originalEvent.stopPropagation();
    e.originalEvent.preventDefault();
    setSelectedObject(null);
    setMarkerPosition(null);
    setIsRightPanelOpen?.(false);
    setClickedClusterId(null);
  }, []);

  const onDblClick = useCallback(
    (e: MapLayerMouseEvent) => {
      if (editMode) e.preventDefault();
      // onMapDblClick?.(e);
      mapClickFn(e);
    },
    [editMode, mapClickFn],
  );

  const onLineClick = useCallback(
    (clickedObject: ISelectedInventoryObject | null) => {
      if (clickedObject) {
        pickedSimilarObjects(clickedObject);
        setSelectedObjectParentID?.(clickedObject.object.p_id);
      }
    },
    [pickedSimilarObjects],
  );

  const onLineContextMenu = (clickedObject: ISelectedInventoryObject | null) => {
    if (!selectedObject && clickedObject) {
      setSelectedObject(clickedObject);
    }
    if (selectedObject && clickedObject) {
      const selObject = selectedObject.object;
      const clObject = clickedObject.object;
      const clObjectSimilarObjects = clickedObject.object.similarObjects;
      const similarIds = clObjectSimilarObjects?.map((so) => so.id);

      if (selObject?.id !== clObject?.id && !similarIds?.includes(selObject.id)) {
        setSelectedObject(clickedObject);
      }
    }
    closeAllContextMenus('marker');
    setIsContextMenuOpen(true);
  };

  const onPointBetweenLineClick = (item: PointsBetweenLine) => {
    closeAllContextMenus('similar');
    setMarkerSimilarObjects(item.consistsObjects);
    setMarkersContextMenuPosition(item.position);
  };

  const onClick = (e: MapLayerMouseEvent) => {
    const clickedLineObject = getClickedObjectLineFromMap(e);
    const clickedPolygonObject = getClickedObjectPolygonFromMap(e);

    if (clickedLineObject || clickedPolygonObject) {
      onLineClick(clickedLineObject || clickedPolygonObject);
    } else {
      onMapClick?.(e);
      mapClickFn(e);
    }
  };

  const onContextMenu = (e: MapLayerMouseEvent) => {
    if (isRightClick && isRulerActive) {
      onMapDblClick?.(e);
    }
    if (isRightClick && !isRulerActive) {
      onMapContextMenu?.(e);

      const clickedLineObject = getClickedObjectLineFromMap(e);

      if (hasPolygonByClick(e)) {
        closeAllContextMenus('polygon');
        setPolygonMenuPosition({ latitude: e.lngLat.lat, longitude: e.lngLat.lng });
      }

      if (clickedLineObject && !hasPolygonByClick(e)) {
        onLineContextMenu(clickedLineObject);
      }

      if (!hasPolygonByClick(e) && !clickedLineObject) {
        closeAllContextMenus('map');
        setMapContextMenuPosition({ latitude: e.lngLat.lat, longitude: e.lngLat.lng });
        mapClickFn(e);
      }
    }
  };

  const onLoadMap = useCallback(
    (e: MapEvent<any>) => {
      getMapInstanceFromEvent(e.target);

      getMapEvent(e);
      onMapLoad?.(e);
      if (isThreeD) e.target.setPitch(60);
      else e.target.setPitch(0);

      if (tempCoordinates) {
        e.target.flyTo({
          center: { lat: tempCoordinates.latitude, lng: tempCoordinates.longitude },
          zoom: tempCoordinates.zoom,
          screenSpeed: tempCoordinates.speed ?? 3,
        });
      }

      if (mapInstanceRef.current == null) mapInstanceRef.current = e.target;
    },
    [getMapEvent, onMapLoad, isThreeD, tempCoordinates, mapInstanceRef, getMapInstanceFromEvent],
  );

  const handleMouseDown = (event: MapLayerMouseEvent) => {
    setPolygonMenuPosition(null);
    if (event.originalEvent.button === 2) {
      setIsRightClick(true);

      const timeout = setTimeout(() => {
        setIsRightClick(false);
      }, 500);

      setClickTimeout(timeout);
    }
  };

  const handleMouseUp = () => {
    if (clickTimeout) clearTimeout(clickTimeout);
  };

  const isEnabledMenuItem = (value: string | string[]): boolean => {
    if (value === 'viewFiles') return permissions?.view ?? true;
    if (value === 'exportData') return permissions?.view ?? true;
    if (value === 'newObject') return permissions?.update ?? true;
    if (value === 'edit') return permissions?.update ?? true;
    if (value === 'details') return detailsPermissions?.view ?? true;
    if (value === 'viewDiagram') return diagramsPermissions?.view ?? true;
    if (value === 'viewTable') return inventoryPermissions?.view ?? true;
    if (value === 'findPath') return inventoryPermissions?.view ?? true;
    if (value === 'createChild') return inventoryPermissions?.update ?? true;
    return true;
  };

  const sizePointBetweenLine = useMemo(() => {
    if (mapViewState?.zoom > 13 && mapViewState?.zoom <= 16) return 35;
    if (mapViewState?.zoom > 16) return 55;
    return 25;
  }, [mapViewState?.zoom]);

  useEffect(() => {
    if (isThreeD) mapInstanceRef.current?.setPitch(60);
    else mapInstanceRef.current?.setPitch(0);
  }, [isThreeD, mapInstanceRef]);

  useEffect(() => {
    if (mapData) {
      onSimilarObjectsContextMenuClose();
    }
  }, [mapData, onSimilarObjectsContextMenuClose]);

  return (
    <MapBoxMapStyled ref={mapContainerRef}>
      {(isLoading || isError) && (
        <LoadingContainer>
          <l-zoomies
            size="180"
            stroke="5"
            bg-opacity="0.2"
            speed={isError ? 0 : 2}
            color={isError ? palette.error.main : palette.primary.main}
          />
        </LoadingContainer>
      )}
      <Map
        cursor={cursor}
        projection={{ name: isThreeD ? 'globe' : 'mercator' }}
        mapStyle={getMapStyle(themeMode, mapStyle, isThreeD ? '3d' : '2d')}
        initialViewState={mapViewState}
        mapboxAccessToken={config._mapboxApiAccessToken}
        onMoveEnd={(e) => onMapViewStateChange?.(e.viewState)}
        onClick={onClick}
        onLoad={onLoadMap}
        onDblClick={onDblClick}
        onContextMenu={onContextMenu}
        onMouseMove={(e) => onMapMouseMove?.(e)}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        preserveDrawingBuffer
      >
        {loadingMarker && (
          <Marker
            latitude={loadingMarker.position.latitude}
            longitude={loadingMarker.position.longitude}
          >
            <l-line-spinner size="60" stroke="3" speed="1" color={palette.primary.main} />
          </Marker>
        )}
        {/* <Marker latitude={40.75262147796218} longitude={-73.94952757060379}> */}
        {/*  <l-line-spinner size="60" stroke="3" speed="1" color={palette.primary.main} /> */}
        {/* </Marker> */}
        <MapBoxLineLayer
          dataGeometry={dataGeometry}
          selectedObject={selectedObject}
          selectedObjectList={selectedObjectList}
        />
        <MapBoxPointsBetweenLineLayer
          data={pointsBetweenLine}
          onClick={onPointBetweenLineClick}
          pointSize={sizePointBetweenLine}
        />
        <MapBoxModelLayer
          dataPoints={pointsWithModel}
          onClick={onModelObjectClick}
          selectedObject={selectedObject}
        />
        <MapBoxRulerLayer rulerSourceData={rulerSourceData} />
        <MapBoxPolygonLayer
          polygonData={dataPolygon}
          multiPolygonData={dataMultiPolygon}
          selectedObject={selectedObject}
        />
        {tileServers.map((tileServer) => (
          <MapBoxTileLayer id={tileServer.id} url={tileServer.url} key={tileServer.id} />
        ))}
        {isContextMenuOpen && selectedObject && (
          <MapBoxContextMenu
            position={selectedObject.position}
            // TODO: Find a way to dyanamically type the `value` parameter of the context menu options
            // @ts-ignore
            options={mapboxContextMenuOptions}
            onMenuClick={onMapBoxContextMenuItemClick}
            onClose={() => setIsContextMenuOpen(false)}
            isEnabledMenuItem={isEnabledMenuItem}
          />
        )}
        {polygonMenuPosition && (
          <MapBoxContextMenu
            position={polygonMenuPosition}
            // TODO: Find a way to dyanamically type the `value` parameter of the context menu options
            // @ts-ignore
            options={polygonContextMenuOptions}
            onMenuClick={onPolygonContextMenuItemClick}
            onClose={() => setPolygonMenuPosition(null)}
            isEnabledMenuItem={isEnabledMenuItem}
          />
        )}
        {mapContextMenuPosition && (
          <MapBoxContextMenu
            position={mapContextMenuPosition}
            onMenuClick={(menuType, position) => onContextMenuItemClick({ menuType, position })}
            options={MAP_CONTEXT_MENU_OPTIONS}
            onClose={() => setMapContextMenuPosition(null)}
            isEnabledMenuItem={isEnabledMenuItem}
          />
        )}
        {markersContextMenuPosition && (
          <MarkerSimilarObjectsContextMenu
            position={markersContextMenuPosition}
            anchor="left"
            onMenuClick={onMarkerSimilarObjectClick}
            options={markerSimilarObjects}
            selectedObject={selectedObject}
            onClose={() => onSimilarObjectsContextMenuClose()}
          />
        )}
        {markerPosition && (
          <MapBoxMarker position={markerPosition} selectedObject={selectedObject} />
        )}
        <ComposedClusterLayer
          onMarkerContextMenu={onMarkerContextMenu}
          onMarkerClick={onMarkerClick}
          onClusterGroupClick={onClusterGroupClick}
          selectedMarker={selectedObject}
          currentZoom={mapViewState?.zoom}
          supercluster={supercluster}
          clusters={clusters}
          selectedMarkerList={selectedObjectList}
          onMarkerDragEnd={
            editMode && !onPointClickWhenEditAndBuildPathBetweenPoint
              ? onObjectOnMapDragEnd
              : undefined
          }
          setPointsWithModel={setPointsWithModel}
          onClusterGroupContextmenu={onClusterGroupContextMenu}
        />
        {clusterChildrenTreePosition && (
          <ClusterGroupContextMenuTree
            supercluster={supercluster}
            clusterId={clickedClusterId}
            position={clusterChildrenTreePosition}
            selectedObject={selectedObject}
            onClick={onClusterGroupContextmenuItemClick}
            whenClose={() => {
              setClusterChildrenTreePosition(null);
              setClickedClusterId(null);
            }}
          />
        )}
        {isFileViewerOpen && (
          <FileViewerWidget
            objectId={selectedObject?.object.id}
            isOpen={isFileViewerOpen}
            onClose={() => setIsFileViewerOpen(false)}
            withModal
          />
        )}
      </Map>
    </MapBoxMapStyled>
  );
};
