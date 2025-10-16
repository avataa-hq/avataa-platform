import { IInventoryBoundsModel } from '6_shared';
import { MapInstanceType } from '6_shared/models/inventoryMapWidget/types';
import { MutableRefObject } from 'react';

export const getMapBoxCurrentBounds = (
  mapRef: MutableRefObject<MapInstanceType | null> | undefined,
) => {
  const mapBoxBounds = mapRef?.current?.getBounds?.();
  if (!mapBoxBounds) return null;

  // @ts-ignore
  const { _ne, _sw } = mapBoxBounds;
  const currentBounds: IInventoryBoundsModel = {
    longitude_min: _sw.lng,
    longitude_max: _ne.lng,
    latitude_min: _sw.lat,
    latitude_max: _ne.lat,
  };
  return currentBounds;
};
