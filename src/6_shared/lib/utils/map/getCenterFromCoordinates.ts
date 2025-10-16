import { AllGeoJSON, center } from '@turf/turf';
import type { ILatitudeLongitude } from '../../../types';

export const getCenterFromCoordinates = (coords: AllGeoJSON): ILatitudeLongitude | null => {
  const centerPosition = center(coords);
  if (centerPosition) {
    const { geometry } = centerPosition;
    return {
      latitude: geometry.coordinates[1],
      longitude: geometry.coordinates[0],
    };
  }
  return null;
};
