import { useMap, Source, Layer } from 'react-map-gl';
import { memo, useEffect, useMemo } from 'react';
import { useTheme } from '@mui/material';
import { ISelectedInventoryObject } from '6_shared/models/inventoryMapWidget/types';
import { createLineLayer, LINE_LAYER_ID, LINE_SOURCE_ID } from './lineLayerCfg';

interface IProps {
  dataGeometry?: GeoJSON.FeatureCollection;
  selectedObject: ISelectedInventoryObject | null;
  selectedObjectList?: Record<string, any>[];

  lineColor?: string;
}

export const MapBoxLineLayer = memo(
  ({ dataGeometry, selectedObject, selectedObjectList, lineColor = 'blue' }: IProps) => {
    const mapRef = useMap();
    const { palette } = useTheme();
    const mapIsLoading = mapRef.current?.getMap().loaded();

    const selectedObjectsIds = useMemo(
      () => [...new Set(!selectedObjectList ? [] : selectedObjectList.map((item) => item.id))],
      [selectedObjectList],
    );

    // УСТАНОВКА ЦВЕТА ЛИНИИ В ЗАВИСИМОСТИ ОТ ВЫБРАННОГО ОБЪЕКТА ИЛИ НЕСКОЛЬКИХ ВЫБРАНЫХ
    useEffect(() => {
      const map = mapRef.current?.getMap();
      if (!map || !mapIsLoading) return;

      const getDefaultColorExpression = [
        'case',
        ['!=', ['get', 'color'], null], // Если цвет из объекта не null
        ['get', 'color'], // Используем цвет из объекта
        palette.primary.main, // Иначе используем цвет по умолчанию
      ];

      let lineColorExpression: any[];

      if (selectedObjectsIds.length) {
        lineColorExpression = [
          'match',
          ['id'],
          selectedObjectsIds,
          palette.success.main,
          getDefaultColorExpression,
        ];
      } else if (selectedObject) {
        lineColorExpression = [
          'match',
          ['id'],
          selectedObject?.object?.id,
          palette.success.main,
          getDefaultColorExpression,
        ];
      } else {
        lineColorExpression = getDefaultColorExpression;
      }

      map.setPaintProperty(LINE_LAYER_ID, 'line-color', lineColorExpression);
    }, [
      mapIsLoading,
      mapRef,
      selectedObject?.object?.id,
      selectedObjectsIds,
      palette.primary.main,
      palette.success.main,
      selectedObject,
    ]);

    // УСТАНОВКА ШИРИНЫ ЛИНИИ НА ОСНОВАНИИ ДАННЫХ САМОГО ОБЪЕКТА И СКАЛИРОВАНИЕ ПРИ ЗУМЕ
    useEffect(() => {
      const map = mapRef.current?.getMap();
      if (!map || !mapIsLoading) return;

      const getCurrentLineWidth: any[] = [
        'case',
        ['!=', ['get', 'lineWidth'], null],
        ['to-number', ['get', 'lineWidth']],
        7,
      ];

      map.setPaintProperty(LINE_LAYER_ID, 'line-width', getCurrentLineWidth);
    }, [mapIsLoading, mapRef]);

    return (
      dataGeometry && (
        <Source tolerance={1} id={LINE_SOURCE_ID} type="geojson" data={dataGeometry}>
          <Layer {...createLineLayer(lineColor)} type="line" source={LINE_SOURCE_ID} />
        </Source>
      )
    );
  },
);
