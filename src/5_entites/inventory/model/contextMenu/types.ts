import { ActionTypes, GetNodesByMoIdModel } from '6_shared';

export type InventoryContextMenuItem =
  | 'Details'
  | 'Edit'
  | 'View files'
  | 'Delete'
  | 'Delete Permanently'
  | 'Restore'
  | 'Show on a map'
  | 'Show in diagram'
  | 'Show linked objects'
  | 'Show history'
  | 'Show related objects'
  | 'Show child objects'
  | 'Find a path'
  | 'Show common path'
  | 'Edit selected objects'
  | 'Duplicate';

interface ClickEventGenericValue {
  [key: string]: number | null;
}

type ClickEventValue = ClickEventGenericValue & {
  'Show in diagram': GetNodesByMoIdModel;
};

export type InventoryContextMenuClickEventHandler = <
  T extends InventoryContextMenuItem = InventoryContextMenuItem,
>(
  item: T,
  value: ClickEventValue[T],
) => void;

export interface InventoryContextMenu {
  rightClickedRowId: number | null;
  onMenuItemClick: InventoryContextMenuClickEventHandler;
  permissions?: Record<ActionTypes, boolean>;
}
