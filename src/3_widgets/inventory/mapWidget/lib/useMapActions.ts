import { useCallback } from 'react';
import { ILatitudeLongitude, useInventoryMapWidget } from '6_shared';

export const useMapActions = () => {
  const { setMapData, setSelectedObjectList, setTempCoordinates } = useInventoryMapWidget();

  const setMapDataAction = useCallback(
    (data: Record<string, any>[]) => {
      setMapData(data);
    },
    [setMapData],
  );

  const setMapSelectedObjectList = useCallback(
    (data: Record<string, any>[]) => {
      setSelectedObjectList(data);
    },
    [setSelectedObjectList],
  );

  const setMapTempCoordinates = useCallback(
    (data: (ILatitudeLongitude & { zoom?: number; speed?: number }) | null) => {
      setTempCoordinates(data);
    },
    [setTempCoordinates],
  );

  return {
    setMapData: setMapDataAction,
    setSelectedObjectList: setMapSelectedObjectList,
    setTempCoordinates: setMapTempCoordinates,
  };
};
