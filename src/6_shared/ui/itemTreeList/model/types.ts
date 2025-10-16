import { ActionTypes } from '6_shared/lib';

export interface ItemTreeListProps<T extends Record<string, any>> {
  items: T[];
  activeItem?: T | null;
  parents?: T[];
  itemIsDraggable?: ((item: T) => boolean) | boolean;
  itemDragType?: string;
  onItemClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, item: T) => void;
  onItemDoubleClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, item: T) => void;
  onItemContextMenu?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, item: T) => void;
  getItemName?: (item: T) => string | number;
  getItemId?: (item: T) => string | number;
  itemKeyAsId?: keyof T;
  getItemIcon?: ((item: T) => React.ReactNode) | React.ReactNode;
  getItemActions?: (item: T) => React.ReactNode;
  getItemEndAdornment?: (item: T) => React.ReactNode;
  isLoading?: boolean;

  getParentIcon?: (item: T) => React.ReactNode;
  onParentClick?: (event: React.SyntheticEvent, item: T) => void;
  onRootClick?: (event: React.SyntheticEvent, item: T) => void;
  getParentId?: (item: T) => string | number;
  getParentName?: (item: T) => React.ReactNode;
  getParentActions?: (item: T) => React.ReactNode;
  displayRoot?: boolean;
  permissions?: Record<ActionTypes, boolean>;
}
