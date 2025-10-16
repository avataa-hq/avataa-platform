import { useEffect, useState } from 'react';
import {
  COMMON_MENU_ITEMS,
  InventoryContextMenuItem,
  MENU_ITEMS_FOR_ACTIVE_OBJECTS,
  MENU_ITEMS_FOR_ARCHIVED_OBJECTS,
} from '../../../model';

interface IProps {
  isObjectsActive: boolean;
}

export const useItemTypes = ({ isObjectsActive }: IProps) => {
  const [itemTypes, setItemTypes] = useState<InventoryContextMenuItem[]>(COMMON_MENU_ITEMS);

  useEffect(() => {
    if (isObjectsActive) {
      const itemsForActiveObjects = COMMON_MENU_ITEMS.filter(
        (item) => !MENU_ITEMS_FOR_ARCHIVED_OBJECTS.includes(item),
      );
      setItemTypes([...itemsForActiveObjects, ...MENU_ITEMS_FOR_ACTIVE_OBJECTS]);
    } else {
      const itemsForNotActiveObjects = COMMON_MENU_ITEMS.filter(
        (item) => !MENU_ITEMS_FOR_ACTIVE_OBJECTS.includes(item),
      );

      setItemTypes([...itemsForNotActiveObjects, ...MENU_ITEMS_FOR_ARCHIVED_OBJECTS]);
    }
  }, [isObjectsActive]);

  return itemTypes;
};
