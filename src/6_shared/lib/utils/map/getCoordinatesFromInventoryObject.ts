import { center } from '@turf/turf';
import type { IInventoryObjectModel, ILatitudeLongitude } from '../../../types';

export const getCoordinatesFromInventoryObject = (
  inventoryObject: IInventoryObjectModel,
): ILatitudeLongitude | null => {
  const { geometry, latitude, longitude } = inventoryObject;

  if (latitude && longitude) return { latitude, longitude };

  if (
    geometry &&
    Object.keys(geometry).length > 0 &&
    geometry.path &&
    geometry.path?.coordinates?.length
  ) {
    const { coordinates, type } = geometry.path;

    const { coordinates: turfCoords } = center({
      type: 'Feature',
      geometry: { coordinates, type },
      properties: null,
    }).geometry;

    if (turfCoords && turfCoords.length > 0) {
      return { longitude: turfCoords[0], latitude: turfCoords[1] };
    }
  }
  return null;
};
