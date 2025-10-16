import { InventoryContextMenuItem } from './types';

export const COMMON_MENU_ITEMS: InventoryContextMenuItem[] = [
  'Details',
  'Edit',
  'View files',
  'Show on a map',
  // 'Show in diagram',
  'Show linked objects',
  'Show history',
  'Show related objects',
  'Show child objects',
  'Find a path',
  'Show common path',
  'Edit selected objects',
  'Duplicate',
];

export const MENU_ITEMS_FOR_ACTIVE_OBJECTS: InventoryContextMenuItem[] = ['Delete'];
export const MENU_ITEMS_FOR_ARCHIVED_OBJECTS: InventoryContextMenuItem[] = [
  'Delete Permanently',
  'Restore',
];
