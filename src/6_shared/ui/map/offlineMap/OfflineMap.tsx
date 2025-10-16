import { MutableRefObject, ReactNode, useEffect, useMemo, useRef } from 'react';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { alpha, Box, useTheme } from '@mui/material';
import { renderToString } from 'react-dom/server';
import { LeafletLayer } from 'deck.gl-leaflet';
import { IconLayer } from '@deck.gl/layers/typed';
import { CollisionFilterExtension } from '@deck.gl/extensions/typed';
import { GeneralMapDataModel, hexToRGB, IDistributorDataModel } from '6_shared/lib';
import { ILatitudeLongitude } from '6_shared/types';
import { useGetMuiIcon } from '../deckGlMap/lib/useGetMuiIcon';

export interface IMapInitialViewState {
  latitude: number;
  longitude: number;
  zoom: number;
  minZoom?: number;
  isMapOfflineMode?: boolean;
}

interface IProps<T extends GeneralMapDataModel> {
  initialViewState?: IMapInitialViewState;
  onMapClick?: (e: any) => void;

  polygonData?: IDistributorDataModel<T>['dataPolygon'];
  multiPolygonData?: IDistributorDataModel<T>['dataMultiPolygon'];
  onPolygonClick?: (object?: T) => void;

  pointsData?: IDistributorDataModel<T>['dataPoints'];
  onPointClick?: (object: T) => void;
  onPointHover?: (object: T) => void;

  polygonTooltip?: (object?: T) => ReactNode;
  pointTooltip?: () => ReactNode;
  pointTooltipPosition?: Partial<ILatitudeLongitude> | null;

  mapRef: MutableRefObject<L.Map | null>;

  offline?: boolean;
}

export const OfflineMap = <T extends GeneralMapDataModel>({
  initialViewState,
  onMapClick,

  multiPolygonData,
  polygonData,
  onPolygonClick,
  polygonTooltip,

  pointsData,
  onPointClick,
  onPointHover,
  pointTooltip,
  pointTooltipPosition,

  mapRef,

  offline,
}: IProps<T>) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { palette } = useTheme();
  const getMuiIcon = useGetMuiIcon();

  const pointsIconLayer = useMemo(() => {
    return new IconLayer<T>({
      id: 'leaflet-icon-layer',
      data: pointsData?.features || [],
      pickable: true,
      alphaCutoff: 0.001,
      getIcon: (site) => ({
        url: getMuiIcon(site.properties.icon ?? 'CellTower'),
        width: 250,
        height: 250,
        mask: true,
      }),
      getColor: ({ properties }) => {
        return properties.color ? hexToRGB(properties.color) : hexToRGB(palette.primary.main);
      },
      getPosition: ({ properties }) => [properties.longitude ?? -1, properties.latitude ?? -1],
      onClick: ({ object }) => onPointClick?.(object.properties as T),
      onHover: ({ object }) => {
        if (object?.properties) {
          onPointHover?.(object.properties as T);
        }
      },
      sizeUnits: 'meters',
      sizeMinPixels: 20,
      sizeMaxPixels: 60,
      getSize: 20,
      sizeScale: 40,
      autoHighlight: true,
      extensions: [new CollisionFilterExtension()],
    });
  }, [getMuiIcon, onPointClick, onPointHover, palette.primary.main, pointsData?.features]);

  useEffect(() => {
    if (!containerRef.current) return () => null;
    const { zoom, latitude, longitude } = { ...initialViewState };

    const correctZoom = zoom == null || +zoom > 10 ? 10 : +zoom;

    const map = L.map(containerRef.current, {
      zoomAnimation: true,
      zoomDelta: 0.1,
      zoomControl: false,
      renderer: L.canvas(),
    }).setView([latitude != null ? +latitude : 0, longitude != null ? +longitude : 0], correctZoom);
    mapRef.current = map;

    if (!offline) {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 3,
        maxZoom: 15,
      }).addTo(map);
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [initialViewState, mapRef, offline]);

  useEffect(() => {
    if (!mapRef.current) return () => null;
    const map = mapRef.current;
    if (onMapClick) map.on('click', onMapClick);
    return () => {
      if (onMapClick) map.off('click', onMapClick);
    };
  }, [mapRef, onMapClick]);

  useEffect(() => {
    if (!mapRef.current) return () => null;
    const map = mapRef.current;
    const onLayerClick = (event: L.LeafletMouseEvent) => {
      const object = event?.propagatedFrom?.feature?.properties as T | undefined;
      onPolygonClick?.(object);
    };

    const features = [...(polygonData?.features ?? []), ...(multiPolygonData?.features ?? [])];

    const geoGroup = features.map((f: any) => {
      const layer = L.geoJSON(f, {
        style: {
          fill: true,
          color: 'white',
          fillOpacity: 1,
          stroke: true,
          interactive: true,
          weight: 0.5,
          fillColor: f.properties.color ?? 'black',
        },
      });
      layer.on('click', onLayerClick);

      layer.bindTooltip((lay) => {
        // @ts-ignore
        if (!lay.feature?.properties) return '';
        // @ts-ignore
        const Tooltip = polygonTooltip(lay.feature?.properties);
        return renderToString(Tooltip);
      });
      return layer;
    });

    const jsonGroup = new L.LayerGroup(geoGroup);
    jsonGroup.addTo(map);

    return () => {
      geoGroup.forEach((g) => g.off('click', onLayerClick));
      jsonGroup.removeFrom(map);
    };
  }, [mapRef, multiPolygonData?.features, onPolygonClick, polygonData?.features, polygonTooltip]);

  useEffect(() => {
    if (!mapRef.current) return () => null;
    const map = mapRef.current;
    const llayr = new LeafletLayer({
      layers: [pointsIconLayer],
    });
    llayr.addTo(map);
    return () => {
      map.removeLayer(llayr);
    };
  }, [mapRef, pointsIconLayer]);

  useEffect(() => {
    if (!mapRef.current) {
      return () => null;
    }

    const map = mapRef.current;
    const Tooltip = pointTooltip?.();
    const popup = L.popup();
    popup.setContent(renderToString(Tooltip));

    if (pointTooltipPosition) {
      const { latitude, longitude } = pointTooltipPosition;
      if (latitude != null && longitude != null) {
        popup.setLatLng([latitude, longitude]);
        map.openPopup(popup);
      }
    }
    return () => {
      map.closePopup();
    };
  }, [mapRef, pointTooltip, pointTooltipPosition]);

  return (
    <Box
      component="div"
      ref={containerRef}
      sx={{
        width: '100%',
        height: '100%',
        background: `${alpha(palette.neutralVariant.outline, 0.2)} !important`,
        ' .leaflet-control-attribution': { display: 'none' },
        ' .leaflet-tooltip': {
          padding: 0,
          border: 'none',
          borderRadius: '5px',
          overflow: 'hidden',
        },
        ' .leaflet-popup-content-wrapper': {
          background: `#fefefe !important`,
          overflow: 'hidden',
        },
        ' .leaflet-popup-content': {
          margin: 0,
          background: 'transparent !important',
          width: '100% !important',
          '& p': { margin: '0 !important', color: 'inherit' },
        },
        // ' .leaflet-popup-content p': { margin: '0 !important' },
      }}
    />
  );
};
