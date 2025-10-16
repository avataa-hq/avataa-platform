import { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { Control } from 'mapbox-gl';
import { Feature, Polygon } from 'geojson';
import { useGetDebounceFunction, useInventoryMapWidget, useTranslate } from '6_shared';
import { area } from '@turf/turf';
import { MapInstanceType } from '6_shared/models/inventoryMapWidget/types';
import { getObjectsInsidePolygon } from '../getObjectsInsidePolygon';
import { useGetLinesRelatedPoints } from '../useGetLinesRelatedPoints';

const polygonInstance = new MapboxDraw({ displayControlsDefault: false });

const uniqueById = (arr: Record<string, any>[]) => {
  return Array.from(new Map(arr.map((item) => [item.id, item])).values());
};

const squareMetersToSquareKilometers = (
  squareMeters: number | null,
  translate: (value: any) => string,
) => {
  if (!squareMeters) return `0 ${translate('m')}²`;
  if (squareMeters > 1000000) {
    const squareKilometers = squareMeters / 1000000;
    return `${squareKilometers.toFixed(1)} ${translate('km')}²`;
  }
  return `${squareMeters?.toFixed()} ${translate('m')}²`;
};

interface IProps {
  mapRef?: MutableRefObject<MapInstanceType | null>;
  mapData?: Record<string, any>[];
}
export const useDrawPolygon = ({ mapRef, mapData }: IProps) => {
  const translate = useTranslate();

  const { isDrawPolygon, setSelectedObjectList, setIsDraw } = useInventoryMapWidget();

  const drawRef = useRef<MapboxDraw>(polygonInstance);

  const [polygonCoordinates, setPolygonCoordinates] = useState<GeoJSON.Position[]>([]);
  const [polygonArea, setPolygonArea] = useState<number | null>(null);

  const { getLinesRelatedPoints } = useGetLinesRelatedPoints();

  const groupedPointsDataById = useMemo(() => {
    return (
      mapData?.reduce((acc, item) => {
        if (item.geometry_type === 'point') {
          acc[item.id] = item;

          if (item.similarObjects?.length) {
            item.similarObjects.forEach((simObject: Record<string, any>) => {
              if (item.geometry_type === 'point') acc[simObject.id] = { ...simObject, HIU: true };
            });
          }
        }
        return acc;
      }, {} as Record<string, any>) ?? {}
    );
  }, [mapData]);

  useEffect(() => {
    if (!isDrawPolygon) setSelectedObjectList([]);
  }, [isDrawPolygon]);

  const clearAllPolygon = useCallback(() => {
    if (!drawRef.current) return;

    const allFeatures = drawRef.current.getAll();

    allFeatures?.features.forEach((f) => {
      if (f.geometry.type === 'Polygon') drawRef?.current?.delete(String(f.id));
    });

    drawRef.current.changeMode('simple_select');
    setIsDraw({ what: 'polygon', value: false });
  }, []);

  const onClickDrawPolygon = useCallback(() => {
    if (isDrawPolygon) clearAllPolygon();
    else {
      setIsDraw({ what: 'polygon', value: true });
      setSelectedObjectList([]);
      setPolygonArea(null);
      drawRef.current.changeMode('draw_polygon');
    }
  }, [clearAllPolygon, isDrawPolygon]);

  const onPolygonCreated = useCallback(
    async (e: any) => {
      const currentFeatures = e.features as Feature[];

      if (currentFeatures.length) {
        if (currentFeatures[0].geometry.type === 'Polygon') {
          setPolygonCoordinates(currentFeatures[0].geometry.coordinates[0]);

          const { pointsInPolygon, linesInPolygon } = getObjectsInsidePolygon(
            e.features[0] as Feature<Polygon, any>,
            mapData ?? [],
          );

          const { linesRelatedPointsA, linesRelatedPointsB } = await getLinesRelatedPoints(
            linesInPolygon,
            groupedPointsDataById,
          );

          let unpackedSelectedObjects: Record<string, any>[] = [];
          [...pointsInPolygon, ...linesInPolygon].forEach((point) => {
            unpackedSelectedObjects.push(point);
            if (point.similarObjects) {
              point.similarObjects.forEach((simObject: Record<string, any>) => {
                const hasSimPoint = unpackedSelectedObjects.find((p) => p.id === simObject.id);
                if (!hasSimPoint) {
                  unpackedSelectedObjects.push(simObject);
                }
              });
            }
          });

          unpackedSelectedObjects = [
            ...unpackedSelectedObjects,
            ...linesRelatedPointsA,
            ...linesRelatedPointsB,
          ];

          const uniqUnpackedSelectedObjects = uniqueById(unpackedSelectedObjects);

          setSelectedObjectList(uniqUnpackedSelectedObjects);

          const polyArea = area(e.features[0]);
          setPolygonArea(polyArea);
        }
      }
    },
    [getLinesRelatedPoints, groupedPointsDataById, mapData],
  );

  const onPolygonCreatedDebounce = useGetDebounceFunction(onPolygonCreated, 200);

  useEffect(() => {
    mapRef?.current?.on('draw.create', onPolygonCreatedDebounce);
    mapRef?.current?.on('draw.update', onPolygonCreatedDebounce);
    return () => {
      mapRef?.current?.off('draw.create', onPolygonCreatedDebounce);
      mapRef?.current?.off('draw.update', onPolygonCreatedDebounce);
    };
  }, [mapRef, onPolygonCreatedDebounce]);

  return {
    drawPolygonInstance: drawRef.current as unknown as Control,
    onClickDrawPolygon,
    clearAllPolygon,
    polygonCoordinates,
    polygonArea: squareMetersToSquareKilometers(polygonArea, translate),
  };
};
