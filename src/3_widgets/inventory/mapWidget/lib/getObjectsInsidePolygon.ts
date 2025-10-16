import { Feature, Polygon } from 'geojson';
import { booleanPointInPolygon } from '@turf/turf';

export const getObjectsInsidePolygon = (
  polygon: Feature<Polygon, any>,
  mapData: Record<string, any>[],
) => {
  const pointsInPolygon: Record<string, any>[] = [];
  const linesInPolygon: Record<string, any>[] = [];

  mapData.forEach((obj) => {
    if (obj.geometry_type === 'point' || (obj.latitude && obj.longitude)) {
      const pointCoords = [obj.longitude, obj.latitude];
      const isPointInPolygon = booleanPointInPolygon(pointCoords, polygon);
      if (isPointInPolygon) pointsInPolygon.push(obj);
    }
    if (obj.geometry_type === 'line' || obj.geometry?.path?.coordinates) {
      const lineCoords = obj.geometry.path.coordinates;
      const isLineIntersectsPolygon = lineCoords.some((coord: any) =>
        booleanPointInPolygon(coord, polygon),
      );
      if (isLineIntersectsPolygon) linesInPolygon.push(obj);
    }
  });

  return { pointsInPolygon, linesInPolygon };
};
