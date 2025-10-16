import { LngLatBounds } from 'mapbox-gl';

export const getObjectsInsideMapBounds = (
  mapBounds: LngLatBounds,
  mapData: Record<string, any>[],
) => {
  const featuresInsideBounds: Record<string, any>[] = [];

  mapData.forEach((obj) => {
    if (obj.geometry_type === 'point' || (obj.latitude && obj.longitude)) {
      const pointCoords = [obj.longitude, obj.latitude];
      if (pointCoords.length === 2 && mapBounds.contains(pointCoords as [number, number])) {
        featuresInsideBounds.push(obj);
      }
    }
    if (obj.geometry_type === 'line' || obj.geometry?.path?.coordinates) {
      const lineCoords = obj.geometry.path?.coordinates;
      const isLineInsideMapBounds = lineCoords.some((coord: any) =>
        mapBounds.contains(coord as [number, number]),
      );
      if (isLineInsideMapBounds) featuresInsideBounds.push(obj);
    }
  });

  return featuresInsideBounds;
};
