import { useEffect, useMemo, useRef } from 'react';
import { CardHeader, useTheme } from '@mui/material';
import * as MuiIcons from '@mui/icons-material';
import Map, {
  Layer,
  LngLatBoundsLike,
  MapRef,
  Marker,
  NavigationControl,
  Source,
  ViewState,
} from 'react-map-gl';
import * as turf from '@turf/turf';

import {
  LocationMarker,
  objectTypesApi,
  useTranslate,
  getCorrectInventoryObjectGeometry,
  getCoordinatesFromInventoryObject,
  useAppNavigate,
  useInventoryMapWidget,
} from '6_shared';
import { useGetInventoryObjectData } from '5_entites';
import config from 'config';

import { ObjectDetailsCard } from './ObjectDetailsCard';
import { IconButtonStyled } from '../commonComponents';
import { MainModuleListE } from '../../../../config/mainModulesConfig';
import { darkSkin, lightSkin } from '../../../../6_shared/ui/map/deckGlMap/config';

interface LocationCardProps {
  objectId: number;
}

const lines: Record<string, number[]> = {
  dotted: [0, 2],
  dashed: [2, 2],
  dotdash: [4, 2, 0, 2],
  twodash: [4, 2, 1, 2],
  longdash: [6, 2],
  solid: [6, 0],
  blank: [0, 0],
};

const { useGetObjectTypeByIdQuery } = objectTypesApi;

export const LocationCard = ({ objectId }: LocationCardProps) => {
  const theme = useTheme();
  const translate = useTranslate();

  const mapRef = useRef<MapRef>(null);

  const navigate = useAppNavigate();

  const { setRequestedObjectId, setSelectedObject, setMapData, setTempCoordinates } =
    useInventoryMapWidget();

  const { inventoryObjectData } = useGetInventoryObjectData({ objectId });
  const { data: objectType } = useGetObjectTypeByIdQuery(inventoryObjectData?.tmo_id!, {
    skip:
      !inventoryObjectData?.tmo_id ||
      !(inventoryObjectData.latitude && inventoryObjectData.longitude),
  });

  const geoJsonData = useMemo(() => {
    if (!inventoryObjectData?.geometry) return null;

    return getCorrectInventoryObjectGeometry(inventoryObjectData.geometry);
  }, [inventoryObjectData]);

  const mapViewState = useMemo<
    | (Pick<ViewState, 'latitude' | 'longitude'> & { bounds?: LngLatBoundsLike; zoom?: number })
    | null
  >(() => {
    if (geoJsonData?.geometry) {
      const center = turf.center(geoJsonData);
      const [minX, minY, maxX, maxY] = turf.bbox(geoJsonData);
      const width = maxX - minX;
      const height = maxY - minY;
      const padding = 0.7;

      return {
        latitude: center.geometry.coordinates[1],
        longitude: center.geometry.coordinates[0],
        bounds: [
          [minX - padding * width, maxY + padding * height],
          [maxX + padding * width, minY - padding * height],
        ],
      };
    }

    if (inventoryObjectData?.latitude && inventoryObjectData?.longitude) {
      return {
        latitude: inventoryObjectData.latitude,
        longitude: inventoryObjectData.longitude,
        zoom: 12,
      };
    }

    return null;
  }, [geoJsonData, inventoryObjectData?.latitude, inventoryObjectData?.longitude]);

  const handleLinkButtonClick = () => {
    navigate(MainModuleListE.map);
    setRequestedObjectId([objectId]);

    if (inventoryObjectData) {
      // eslint-disable-next-line no-case-declarations
      const position = getCoordinatesFromInventoryObject(inventoryObjectData);
      if (position) {
        setSelectedObject({ object: inventoryObjectData, position });
        setMapData([inventoryObjectData]);

        setTempCoordinates({
          latitude: position.latitude,
          longitude: position.longitude,
          zoom: 14,
          speed: 3.5,
        });
      }
    }
  };

  useEffect(() => {
    if (!mapViewState) return;

    mapRef.current?.flyTo({
      center: [mapViewState.longitude, mapViewState.latitude],
    });
    if (mapViewState.bounds) mapRef.current?.fitBounds(mapViewState.bounds);
  }, [mapViewState]);

  if (
    !inventoryObjectData?.latitude &&
    !inventoryObjectData?.longitude &&
    (!inventoryObjectData?.geometry || !geoJsonData)
  )
    return null;

  return (
    <ObjectDetailsCard sx={{ position: 'relative' }}>
      <CardHeader
        action={<IconButtonStyled onClick={handleLinkButtonClick} />}
        title={translate('Location')}
        sx={{ position: 'relative', zIndex: 2 }}
      />
      <Map
        ref={mapRef}
        initialViewState={mapViewState ?? undefined}
        style={{ width: '100%', height: '100%', top: 0, left: 0, position: 'absolute' }}
        mapboxAccessToken={config._mapboxApiAccessToken}
        mapStyle={theme.palette.mode === 'dark' ? darkSkin : lightSkin}
      >
        <NavigationControl showCompass={false} position="bottom-right" />
        {(geoJsonData?.geometry.type === 'MultiPoint' ||
          geoJsonData?.geometry.type === 'LineString') && (
          <Source type="geojson" data={geoJsonData}>
            <Layer
              type="line"
              paint={{
                ...(objectType?.icon && {
                  'line-dasharray': lines[objectType.icon] ?? lines.solid,
                }),
                'line-color': theme.palette.primary.main,
              }}
            />
          </Source>
        )}
        {(geoJsonData?.geometry.type === 'Polygon' ||
          geoJsonData?.geometry.type === 'MultiPolygon') && (
          <Source type="geojson" data={geoJsonData}>
            <Layer
              type="fill"
              paint={{
                'fill-color': theme.palette.primary.main,
              }}
            />
          </Source>
        )}
        {!inventoryObjectData?.geometry &&
          inventoryObjectData?.latitude &&
          inventoryObjectData?.longitude && (
            <Marker
              latitude={inventoryObjectData.latitude}
              longitude={inventoryObjectData.longitude}
            >
              <LocationMarker
                title={inventoryObjectData.name}
                // @ts-ignore There is a fallback in case the icon is not found
                IconComponent={objectType?.icon && (MuiIcons[objectType?.icon] ?? undefined)}
              />
            </Marker>
          )}
      </Map>
    </ObjectDetailsCard>
  );
};
