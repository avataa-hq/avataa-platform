import { useMemo } from 'react';
import { GridRowSelectionModel } from '@mui/x-data-grid-premium';
import {
  ActionTypes,
  getCoordinatesFromInventoryObject,
  getInventoryObjectWithCorrectGeometry,
  IInventoryObjectModel,
  useGetPermissions,
} from '6_shared';
import { InventoryContextMenuItem } from '../../../model';

interface IProps {
  inventoryObjectData?: IInventoryObjectModel;
  permissions?: Record<ActionTypes, boolean>;
  selectedRows?: GridRowSelectionModel;
}

export const useSetDisabledItems = ({ inventoryObjectData, permissions, selectedRows }: IProps) => {
  const mapPermissions = useGetPermissions('map');
  const detailsPermissions = useGetPermissions('details');

  const canShowOnMap = useMemo(() => {
    if (!inventoryObjectData) return false;
    const objectWithCorrectGeometry = getInventoryObjectWithCorrectGeometry(inventoryObjectData);
    return !!getCoordinatesFromInventoryObject(objectWithCorrectGeometry as IInventoryObjectModel);
  }, [inventoryObjectData]);

  return (item: InventoryContextMenuItem) => {
    const detailsPermissionsItems = ['Details'];
    const updatePermissionsItems = ['Edit', 'Delete', 'Restore'];
    const viewPermissionsItems = [
      'View Files',
      'Show linked objects',
      'Show history',
      'Show related objects',
      'Show child objects',
      'Find a path',
    ];
    const advancedViewPermissionsItems = ['Show common path'];
    const mapPermissionsItems = ['Show on a map'];
    const administratePermissionsItems = ['Delete Permanently'];

    if (detailsPermissionsItems.includes(item)) return !(detailsPermissions?.view ?? true);
    if (updatePermissionsItems.includes(item)) return !(permissions?.update ?? true);
    if (viewPermissionsItems.includes(item)) return !(permissions?.view ?? true);
    if (advancedViewPermissionsItems.includes(item))
      return !(permissions?.view ?? true) || new Set(selectedRows).size !== 2;
    if (mapPermissionsItems.includes(item)) return !canShowOnMap || !(mapPermissions?.view ?? true);
    if (administratePermissionsItems.includes(item)) return !(permissions?.administrate ?? true);

    return undefined;
  };
};
