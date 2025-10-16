import { calculateAverageLinePath } from '5_entites';
import { IInventoryObjectModel } from '6_shared';
import { LngLatLike } from 'mapbox-gl';

export const getFlyToCoordinatesCenter = (selectedTraceObject: IInventoryObjectModel) => {
  let center: LngLatLike | undefined;

  if (selectedTraceObject.geometry) {
    const lineCenterCoordinates = calculateAverageLinePath(
      selectedTraceObject.geometry.path.coordinates as number[][],
    );
    center = {
      lng: lineCenterCoordinates.lng,
      lat: lineCenterCoordinates.lat,
    };
  } else {
    center = {
      lng: (selectedTraceObject.longitude as number) ?? undefined,
      lat: (selectedTraceObject.latitude as number) ?? undefined,
    };
  }

  return center;
};
