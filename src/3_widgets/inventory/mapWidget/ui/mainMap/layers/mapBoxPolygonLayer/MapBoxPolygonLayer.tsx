import { Source, Layer, useMap } from 'react-map-gl';
import mbx from 'mapbox-gl';
import { GeoJSONMultiPolygon, GeoJSONPolygon, IInventoryObjectModel } from '6_shared';
import { useEffect } from 'react';
import { useTheme } from '@mui/material';
import { ISelectedInventoryObject } from '6_shared/models/inventoryMapWidget/types';
import {
  MULTIPOLYGON_LAYER_ID,
  MULTIPOLYGON_LAYER_SOURCE_ID,
  POLYGON_LAYER_ID,
  POLYGON_LAYER_SOURCE_ID,
} from './polygonLayerCfg';

interface IProps {
  polygonData?: GeoJSONPolygon<IInventoryObjectModel>;
  multiPolygonData?: GeoJSONMultiPolygon<IInventoryObjectModel>;
  selectedObject: ISelectedInventoryObject | null;
}
export const MapBoxPolygonLayer = ({ polygonData, multiPolygonData, selectedObject }: IProps) => {
  const mapRef = useMap();
  const { palette } = useTheme();
  const mapIsLoading = mapRef.current?.getMap().loaded();

  const polygonFillPaint: mbx.FillPaint = {
    'fill-color': 'blue',
    'fill-opacity': 0.5,
    'fill-outline-color': 'black',
  };
  const multiPolygonFillPaint: mbx.FillPaint = {
    'fill-color': 'blue',
    'fill-opacity': 0.5,
    'fill-outline-color': 'black',
  };

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !mapIsLoading) return;
    const getDefaultColorExpression = [
      'case',
      ['!=', ['get', 'color'], null], // Если цвет из объекта не null
      ['get', 'color'], // Используем цвет из объекта
      palette.primary.main, // Иначе используем цвет по умолчанию
    ];

    let lineColorExpression: any[] = getDefaultColorExpression;

    if (selectedObject) {
      lineColorExpression = [
        'match',
        ['id'],
        selectedObject?.object?.id,
        palette.success.main,
        getDefaultColorExpression,
      ];
    }
    map.setPaintProperty(POLYGON_LAYER_ID, 'fill-color', lineColorExpression);
    map.setPaintProperty(MULTIPOLYGON_LAYER_ID, 'fill-color', lineColorExpression);
  }, [mapIsLoading, mapRef, palette.primary.main, palette.success.main, selectedObject]);

  if (polygonData && multiPolygonData) {
    return (
      <>
        <Source id={POLYGON_LAYER_SOURCE_ID} type="geojson" data={polygonData}>
          <Layer
            id={POLYGON_LAYER_ID}
            source={POLYGON_LAYER_SOURCE_ID}
            type="fill"
            paint={polygonFillPaint}
          />
        </Source>
        <Source id={MULTIPOLYGON_LAYER_SOURCE_ID} type="geojson" data={multiPolygonData}>
          <Layer
            id={MULTIPOLYGON_LAYER_ID}
            source={MULTIPOLYGON_LAYER_SOURCE_ID}
            type="fill"
            paint={multiPolygonFillPaint}
          />
        </Source>
      </>
    );
  }

  if (polygonData) {
    return (
      <Source id={POLYGON_LAYER_SOURCE_ID} type="geojson" data={polygonData}>
        <Layer
          id={POLYGON_LAYER_ID}
          source={POLYGON_LAYER_SOURCE_ID}
          type="fill"
          paint={polygonFillPaint}
        />
      </Source>
    );
  }

  if (multiPolygonData) {
    return (
      <Source id={MULTIPOLYGON_LAYER_SOURCE_ID} type="geojson" data={multiPolygonData}>
        <Layer
          id={MULTIPOLYGON_LAYER_ID}
          source={MULTIPOLYGON_LAYER_SOURCE_ID}
          type="fill"
          paint={multiPolygonFillPaint}
        />
      </Source>
    );
  }

  return null;
};
