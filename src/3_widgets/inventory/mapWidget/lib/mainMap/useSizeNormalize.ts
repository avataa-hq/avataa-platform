import { MutableRefObject, useCallback, useEffect } from 'react';
import { useSidebar } from '6_shared';
import { MapInstanceType } from '6_shared/models/inventoryMapWidget/types';

interface IProps {
  mapInstance: MutableRefObject<MapInstanceType | null>;
}

export const useSizeNormalize = ({ mapInstance }: IProps) => {
  const { isOpen } = useSidebar();

  const resizeMap = useCallback(() => {
    if (mapInstance?.current?.resize) {
      setTimeout(() => mapInstance?.current?.resize(), 400);
    }
  }, [mapInstance]);

  useEffect(() => {
    document.addEventListener('toggleSidebar', resizeMap);
    return () => document.removeEventListener('toggleSidebar', resizeMap);
  }, [mapInstance, resizeMap]);

  useEffect(() => {
    resizeMap();
  }, [isOpen]);

  return null;
};
