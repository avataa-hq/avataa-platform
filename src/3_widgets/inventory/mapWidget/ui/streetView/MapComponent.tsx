import { useMap, Map, useStreetViewPanorama } from '@vis.gl/react-google-maps';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import PushPinRoundedIcon from '@mui/icons-material/PushPinRounded';
import Supercluster, { AnyProps, ClusterProperties, PointFeature } from 'supercluster';
import {
  GeoJSONMultiPolygon,
  GeoJSONPolygon,
  GeoJSONLineString,
  ILatitudeLongitude,
  Button,
  // GeoJSONMultiPoint,
  // IInventoryObjectModel,
  useInventoryMapWidget,
} from '6_shared';
import { BBox } from 'geojson';
import { tailChase } from 'ldrs';
import { useTheme } from '@mui/material';
import { STREET_VIEW_MAP_ID } from '6_shared/models/inventoryMapWidget/constants';
import {
  LoadingContainer,
  MapContainer,
  PanoramaContainer,
  PinButtonContainer,
  SearchContainer,
  StreetViewStyled,
} from './StreetView.styled';
import { ClusterLayer } from './layers/ClusterLayer';
import { LineLayers } from './layers/LineLayers';
import { PolygonLayer } from './layers/PolygonLayer';

tailChase.register();

export interface IMapComponentProps {
  isLoading?: boolean;
  lineStringData?: GeoJSONLineString<any>;
  polygonData?: GeoJSONPolygon<any>;
  multiPolygonData?: GeoJSONMultiPolygon<any>;

  clusters?: (PointFeature<any> | PointFeature<ClusterProperties & AnyProps>)[];
  supercluster?: Supercluster<any, AnyProps>;

  setGeneralBounds?: (bounds: BBox) => void;

  topRightContainer?: React.ReactNode;
}

export const MapComponent = memo(
  ({
    isLoading,
    multiPolygonData,
    polygonData,
    lineStringData,

    supercluster,
    clusters,

    setGeneralBounds,

    topRightContainer,
  }: IMapComponentProps) => {
    const { palette } = useTheme();

    const panoramaContainerRef = useRef<HTMLDivElement | null>(null);
    const map = useMap(STREET_VIEW_MAP_ID);

    const [isPinMapSize, setIsPinMapSize] = useState(false);

    const { tempCoordinates, mapViewState, setMapViewState } = useInventoryMapWidget();

    // Panorama options

    const panorama = useStreetViewPanorama({
      divElement: panoramaContainerRef.current,
      position: { lat: mapViewState.latitude, lng: mapViewState.longitude },
      mapId: 'swMap',
    });

    useEffect(() => {
      panorama?.setOptions({ addressControl: false, fullscreenControl: false });
    }, [panorama]);

    // =================

    useEffect(() => {
      if (!tempCoordinates) return;
      map?.setCenter({ lat: tempCoordinates.latitude, lng: tempCoordinates.longitude });
      panorama?.setPosition({ lat: tempCoordinates.latitude, lng: tempCoordinates.longitude });
    }, [tempCoordinates, map, panorama]);

    const onMarkerClick = useCallback(
      (position: ILatitudeLongitude, expansionZoom?: number) => {
        if (map && panorama) {
          map.setCenter({ lat: position.latitude, lng: position.longitude });
          if (expansionZoom !== undefined) {
            map.setZoom(expansionZoom);
            setMapViewState({ ...mapViewState, zoom: expansionZoom });
          } else {
            panorama.setPosition({ lat: position.latitude, lng: position.longitude });
          }
        }
      },
      [map, panorama, mapViewState],
    );

    return (
      <StreetViewStyled>
        <PanoramaContainer ref={panoramaContainerRef} />
        <MapContainer
          sx={{ width: isPinMapSize ? '50%' : '20%', height: isPinMapSize ? '50%' : '20%' }}
        >
          {isLoading && (
            <LoadingContainer>
              <l-tail-chase size="80" speed="1.75" color={palette.primary.main} />
            </LoadingContainer>
          )}
          <Map
            id={STREET_VIEW_MAP_ID}
            controlSize={40}
            fullscreenControl={false}
            streetView={panorama}
            center={{ lat: mapViewState.latitude, lng: mapViewState.longitude }}
            zoom={mapViewState.zoom}
            onBoundsChanged={(event) => {
              const { east, north, south, west } = event.detail.bounds;
              setGeneralBounds?.([west, south, east, north]);
            }}
            onZoomChanged={(event) => {
              const { east, north, south, west } = event.detail.bounds;
              setMapViewState({ ...mapViewState, zoom: event.detail.zoom });
              setGeneralBounds?.([west, south, east, north]);
            }}
          >
            <PinButtonContainer>
              <Button onClick={() => setIsPinMapSize((p) => !p)} active={isPinMapSize}>
                <PushPinRoundedIcon fontSize="small" color={isPinMapSize ? 'primary' : 'inherit'} />
              </Button>
            </PinButtonContainer>
            <ClusterLayer
              clusters={clusters}
              supercluster={supercluster}
              onClusterClick={onMarkerClick}
            />
            <LineLayers lineStringData={lineStringData} onLineClick={onMarkerClick} />
            <PolygonLayer multiPolygonData={multiPolygonData} polygonData={polygonData} />
          </Map>
        </MapContainer>
        <SearchContainer>{topRightContainer}</SearchContainer>
      </StreetViewStyled>
    );
  },
);
