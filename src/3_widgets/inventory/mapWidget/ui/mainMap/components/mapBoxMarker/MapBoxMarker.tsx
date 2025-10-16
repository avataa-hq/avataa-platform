/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useEffect, useState } from 'react';
import { Marker } from 'react-map-gl';
import { Box, Menu, MenuItem } from '@mui/material';
import {
  ILatitudeLongitude,
  NamedObjectPoint,
  useInventoryMapWidget,
  useObjectCRUD,
  useTranslate,
} from '6_shared';
import { getIcon } from '5_entites';
import { ISelectedInventoryObject } from '6_shared/models/inventoryMapWidget/types';

interface IProps {
  position: ILatitudeLongitude;
  selectedObject: ISelectedInventoryObject | null;
}

export const MapBoxMarker = ({ position, selectedObject }: IProps) => {
  const translate = useTranslate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { setMarkerPosition } = useInventoryMapWidget();

  const { setIsObjectCRUDModalOpen, setNewObjectCoordinates } = useObjectCRUD();

  useEffect(() => {
    setNewObjectCoordinates({
      latitude: position.latitude,
      longitude: position.longitude,
    });
  }, [position, setNewObjectCoordinates]);

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.button === 2) {
      handleContextMenu(event);

      //   if (currentCoordinates && currentCoordinates.latitude && currentCoordinates.longitude) {
      //
      //       setNewObjectCoordinates({
      //         latitude: currentCoordinates.latitude,
      //         longitude: currentCoordinates.longitude,
      //       }
      //     );
      //   }
    }
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMarkerPosition(null);
  };

  const onMenuItemClick = () => {
    setIsObjectCRUDModalOpen(true);
  };

  return (
    <Box component="div" onContextMenu={(e: React.MouseEvent) => e.preventDefault()}>
      <Marker
        draggable
        latitude={position.latitude}
        longitude={position.longitude}
        onDrag={(e) => {
          setMarkerPosition({
            latitude: e.lngLat.lat,
            longitude: e.lngLat.lng,
          });
          // setCurrentCoordinates({
          //   latitude: e.lngLat.lat,
          //   longitude: e.lngLat.lng,
          // });

          setNewObjectCoordinates({
            latitude: e.lngLat.lat,
            longitude: e.lngLat.lng,
          });
        }}
      >
        {selectedObject && (
          <Box component="div" sx={{ width: '150px' }} onMouseDown={handleMouseDown}>
            <NamedObjectPoint
              icon={getIcon(selectedObject.object.icon)}
              title={selectedObject.object.name}
              // description={selectedObject.object.name}
            />
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
              <MenuItem onClick={onMenuItemClick}>{translate('Create New Object')}</MenuItem>
            </Menu>
          </Box>
        )}
      </Marker>
    </Box>
  );
};
