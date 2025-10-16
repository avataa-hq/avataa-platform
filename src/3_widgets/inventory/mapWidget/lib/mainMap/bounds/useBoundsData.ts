import { IInventoryBoundsModel, useGetDebounceFunction } from '6_shared';
import { MutableRefObject, useCallback, useEffect } from 'react';
import { IMapViewState, MapInstanceType } from '6_shared/models/inventoryMapWidget/types';
import { getBoundsListByZoomAndPadding } from './getBoundsListByZoomAndPadding';
import { checkIsInsideBounds } from './checkIsInsideBounds';
import { getMapBoxCurrentBounds } from './getMapBoxCurrentBounds';

interface IProps {
  mapViewState: IMapViewState;
  mapBoxInstance?: MutableRefObject<MapInstanceType | null>;

  setOuterMapBounds?: (bounds: IInventoryBoundsModel) => void;
  setPaddingMapBounds?: (bounds: IInventoryBoundsModel) => void;
}
export const useBoundsData = ({
  mapViewState,
  mapBoxInstance,
  setOuterMapBounds,
  setPaddingMapBounds,
}: IProps) => {
  const setBounds = useCallback(
    (
      viewState: IMapViewState,
      outerMapBounds: IInventoryBoundsModel | null,
      paddingBounds: IInventoryBoundsModel | null,
    ) => {
      const currentBounds = getMapBoxCurrentBounds(mapBoxInstance);
      const padding = 500;
      const boundsList = getBoundsListByZoomAndPadding(currentBounds, viewState.zoom, padding);

      if (boundsList && currentBounds) {
        const outOfBounds = checkIsInsideBounds(currentBounds, paddingBounds);
        const { boundsWithSmallPadding, boundsWithBigPadding } = boundsList;
        if (outerMapBounds === null) {
          setOuterMapBounds?.(boundsWithBigPadding);
          setPaddingMapBounds?.(boundsWithSmallPadding);
        }
        if (Object.keys(outOfBounds).length) {
          if (outerMapBounds !== null) {
            const { latitude_max, longitude_max, longitude_min, latitude_min } = outOfBounds;
            const newBounds: IInventoryBoundsModel = {
              latitude_max: !latitude_max
                ? outerMapBounds.latitude_max
                : Math.max(latitude_max, outerMapBounds.latitude_max),
              longitude_max: !longitude_max
                ? outerMapBounds.longitude_max
                : Math.max(longitude_max, outerMapBounds.longitude_max),
              latitude_min: !latitude_min
                ? outerMapBounds.latitude_min
                : Math.min(latitude_min, outerMapBounds.latitude_min),
              longitude_min: !longitude_min
                ? outerMapBounds.longitude_min
                : Math.min(longitude_min, outerMapBounds.longitude_min),
            };
            setOuterMapBounds?.(newBounds);
            setPaddingMapBounds?.(boundsWithSmallPadding);
          }
        }
      }
    },
    [mapBoxInstance, setOuterMapBounds, setPaddingMapBounds],
  );

  const debounceSetBounds = useGetDebounceFunction(setBounds, 200);

  useEffect(() => {
    const onAddItem = () => {
      const bounds = getMapBoxCurrentBounds(mapBoxInstance);
      const padding = 500;
      const boundsList = getBoundsListByZoomAndPadding(bounds, mapViewState.zoom, padding);

      if (boundsList) {
        const { boundsWithBigPadding, boundsWithSmallPadding } = boundsList;

        setOuterMapBounds?.(boundsWithBigPadding); // response by this
        setPaddingMapBounds?.(boundsWithSmallPadding);
      }
    };
    document.addEventListener('tmoIdAdd', onAddItem);

    return () => {
      document.removeEventListener('tmoIdAdd', onAddItem);
    };
  }, [mapViewState.zoom, mapBoxInstance, setOuterMapBounds, setPaddingMapBounds]);

  return { setBounds: debounceSetBounds };
};
