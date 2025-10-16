import { IInventoryBoundsModel } from '6_shared';
import { getBoundsPadding } from './getBoundsPadding';

export const getBoundsListByZoomAndPadding = (
  bounds: IInventoryBoundsModel | null,
  zoom: number,
  padding: number = 1,
) => {
  if (!bounds) return null;
  const { longitude_min, latitude_min, longitude_max, latitude_max } = bounds;

  const lat_min_pad = getBoundsPadding(latitude_min, zoom, padding);
  const lat_max_pad = getBoundsPadding(latitude_max, zoom, padding);
  const lon_min_pad = getBoundsPadding(longitude_min, zoom, padding);
  const lon_max_pad = getBoundsPadding(longitude_max, zoom, padding);

  const lat_min_pad_half = getBoundsPadding(latitude_min, zoom, padding / 2);
  const lat_max_pad_half = getBoundsPadding(latitude_max, zoom, padding / 2);
  const lon_min_pad_half = getBoundsPadding(longitude_min, zoom, padding / 2);
  const lon_max_pad_half = getBoundsPadding(longitude_max, zoom, padding / 2);

  const boundsWithBigPadding = {
    latitude_min: latitude_min - lat_min_pad,
    latitude_max: latitude_max + lat_max_pad,
    longitude_min: longitude_min + lon_min_pad,
    longitude_max: longitude_max - lon_max_pad,
  };
  const boundsWithSmallPadding = {
    latitude_min: latitude_min - lat_min_pad_half,
    latitude_max: latitude_max + lat_max_pad_half,
    longitude_min: longitude_min + lon_min_pad_half,
    longitude_max: longitude_max - lon_max_pad_half,
  };

  return { boundsWithBigPadding, boundsWithSmallPadding };
};
