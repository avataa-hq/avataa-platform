import { MutableRefObject } from 'react';
import { LngLatBounds } from 'mapbox-gl';
import { enqueueSnackbar } from 'notistack';
import { useInventoryMapWidget, useObjectCRUD, useTranslate } from '6_shared';
import {
  ISelectedInventoryObject,
  MapBoxMapContextMenuType,
} from '6_shared/models/inventoryMapWidget/types';
import { exportToExcel } from './exportToExcel';
import { getObjectsInsideMapBounds } from './getObjectsInsideMapBounds';
import { exportToTab } from './exportToTab';
import { exportToKml } from './exportToKml';
import { exportImage } from './exportImage';

interface IContextMenuProps {
  menuType: MapBoxMapContextMenuType | string;
  position: ISelectedInventoryObject['position'];
}

interface IProps {
  mapData?: Record<string, any>[];
  mapBounds: LngLatBounds | undefined;
  mapContainerRef: MutableRefObject<HTMLElement | null>;
}

export const useMapContextMenu = ({ mapData, mapBounds, mapContainerRef }: IProps) => {
  const translate = useTranslate();

  const { setMarkerPosition } = useInventoryMapWidget();

  const { setIsObjectCRUDModalOpen } = useObjectCRUD();

  const displayNoDataForExportMessage = () => {
    return enqueueSnackbar(translate('There is no data to export'), {
      variant: 'info',
      anchorOrigin: { horizontal: 'right', vertical: 'top' },
    });
  };

  const displayErrorMessage = () => {
    return enqueueSnackbar(translate('Something went wrong, please try once more'), {
      variant: 'error',
      anchorOrigin: { horizontal: 'right', vertical: 'top' },
    });
  };

  const onContextMenuItemClick = async ({ menuType, position }: IContextMenuProps) => {
    switch (menuType) {
      case 'newObject':
        if (position.latitude && position.longitude) {
          setMarkerPosition({
            latitude: position.latitude,
            longitude: position.longitude,
          });
        }
        setIsObjectCRUDModalOpen(true);
        break;

      case 'toExcel':
        if (mapData && mapBounds) {
          const objectsInsideMapBounds = getObjectsInsideMapBounds(mapBounds, mapData);
          if (objectsInsideMapBounds.length === 0) {
            displayNoDataForExportMessage();
            return;
          }
          try {
            await exportToExcel({ selectedObjectList: objectsInsideMapBounds });
          } catch (error) {
            displayErrorMessage();
          }
        }
        break;

      case 'toTab':
        if (mapData && mapBounds) {
          const objectsInsideMapBounds = getObjectsInsideMapBounds(mapBounds, mapData);
          if (objectsInsideMapBounds.length === 0) {
            displayNoDataForExportMessage();
            return;
          }
          try {
            await exportToTab({ selectedObjectList: objectsInsideMapBounds });
          } catch (error) {
            displayErrorMessage();
          }
        }
        break;

      case 'toKml':
        if (mapData && mapBounds) {
          const objectsInsideMapBounds = getObjectsInsideMapBounds(mapBounds, mapData);
          if (objectsInsideMapBounds.length === 0) {
            displayNoDataForExportMessage();
            return;
          }
          try {
            await exportToKml({ selectedObjectList: objectsInsideMapBounds });
          } catch (error) {
            displayErrorMessage();
          }
        }
        break;

      case 'toJpeg':
        try {
          await exportImage({ exportFormat: 'jpeg', mapContainerRef });
        } catch (error) {
          displayErrorMessage();
        }
        break;

      case 'toPng':
        try {
          await exportImage({ exportFormat: 'png', mapContainerRef });
        } catch (error) {
          displayErrorMessage();
        }
        break;

      default:
        break;
    }
  };

  return { onContextMenuItemClick };
};
