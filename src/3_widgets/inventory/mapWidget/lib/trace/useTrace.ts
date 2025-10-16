import { useEffect } from 'react';
import { IInventoryObjectModel, useInventoryMapWidget } from '6_shared';
import { getFlyToCoordinatesCenter } from '../getFlyToCoordinatesCenter';

interface IProps {
  selectedTraceObject: IInventoryObjectModel | null;
  mapData?: Record<string, any>[];
}

export const useTrace = ({ selectedTraceObject, mapData }: IProps) => {
  const { setMarkerPosition, setSelectedObject, setMapData, setTempCoordinates } =
    useInventoryMapWidget();

  useEffect(() => {
    if (selectedTraceObject) {
      setMarkerPosition(null);

      const { geometry, longitude, latitude, id } = selectedTraceObject;

      const currentObject = mapData?.find((item) => item.id === id);

      if (!currentObject && !geometry && latitude && longitude) {
        setMarkerPosition({ latitude, longitude });
        setMapData([]);

        const selObj = { position: { latitude, longitude }, object: selectedTraceObject };
        setSelectedObject(selObj);
      }

      if (!currentObject && geometry) {
        setMapData([selectedTraceObject]);
      }

      if (currentObject && geometry) {
        const { lng, lat } = getFlyToCoordinatesCenter(selectedTraceObject);

        setSelectedObject({
          position: { latitude: lat, longitude: lng },
          object: selectedTraceObject,
        });
      }

      if ((longitude && latitude) || geometry) {
        const { lng, lat } = getFlyToCoordinatesCenter(selectedTraceObject);
        setTempCoordinates({ latitude: lat, longitude: lng, zoom: 18 });
      }
    }
  }, [selectedTraceObject]);

  return null;
};
