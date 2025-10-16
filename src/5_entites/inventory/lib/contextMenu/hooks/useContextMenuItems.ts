import { IMenuItem, useInventoryTable, useObjectCRUD, useTranslate } from '6_shared';
import { useMemo } from 'react';
import { useGetInventoryObjectData } from '../../../api';
import { useItemTypes } from './useItemTypes';
import { useSetDisabledItems } from './useSetDisabledItems';
import { InventoryContextMenu } from '../../../model';

export const useContextMenuItems = ({
  onMenuItemClick,
  rightClickedRowId,
  permissions,
}: InventoryContextMenu): IMenuItem[] => {
  const translate = useTranslate();

  const { inventoryObjectData } = useGetInventoryObjectData({
    objectId: rightClickedRowId ?? null,
  });

  const { selectedRows } = useInventoryTable();
  const { isObjectsActive } = useObjectCRUD();

  const isDisabled = useSetDisabledItems({ inventoryObjectData, permissions, selectedRows });

  const items = useItemTypes({ isObjectsActive });

  return useMemo(() => {
    return items.map((item) => ({
      item: translate(item),
      action: () => onMenuItemClick(item, rightClickedRowId),
      disabled: isDisabled(item),
    }));
  }, [isDisabled, items, onMenuItemClick, rightClickedRowId, translate]);
};
