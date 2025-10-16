import { IInventoryBoundsModel } from '6_shared';

export const checkIsInsideBounds = (
  currentBounds: IInventoryBoundsModel,
  paddingBounds: IInventoryBoundsModel | null,
): Partial<IInventoryBoundsModel> => {
  const outOfBounds: Partial<IInventoryBoundsModel> = {};

  if (paddingBounds) {
    if (currentBounds.latitude_min < paddingBounds.latitude_min) {
      outOfBounds.latitude_min = currentBounds.latitude_min;
    }
    if (currentBounds.latitude_max > paddingBounds.latitude_max) {
      outOfBounds.latitude_max = currentBounds.latitude_max;
    }
    if (currentBounds.longitude_min < paddingBounds.longitude_min) {
      outOfBounds.longitude_min = currentBounds.longitude_min;
    }
    if (currentBounds.longitude_max > paddingBounds.longitude_max) {
      outOfBounds.longitude_max = currentBounds.longitude_max;
    }
  }

  return outOfBounds;
};
